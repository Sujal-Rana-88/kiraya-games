"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { fetchUserGames, fetchUserRentals } from "@/lib/api";
import GameHistoryList from "@/components/game-history-list";
import type { Game } from "@/types/game";
import axios from "axios";
import API_URLS from "@/config/urls";
import { CameraIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
    const { user, loading, logout, updatePassword } = useAuth();
    const [lendHistory, setLendHistory] = useState<Game[]>([]);
    const [rentHistory, setRentHistory] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updating, setUpdating] = useState(false);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loadingSave, setLoading] = useState(false);
    const [token, setStoredToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);

    useEffect(() => {
        // This code only runs on the client
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('user_id');
        const storedFirstName = localStorage.getItem('first_name');
        const storedLastName = localStorage.getItem('last_name');
        const storedProfilePicture = localStorage.getItem("profilePicture");

        setStoredToken(storedToken);
        setUserId(storedUserId);
        setFirstName(storedFirstName);
        setLastName(storedLastName);
        setFormData({
            firstName: storedFirstName || "",
            lastName: storedLastName || "",
        });
        setImagePreview(storedProfilePicture || null);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            const loadData = async () => {
                try {
                    const [lendedGames, rentedGames] = await Promise.all([
                        fetchUserGames(user.uid),
                        fetchUserRentals(user.uid),
                    ]);
                    setLendHistory(lendedGames);
                    setRentHistory(rentedGames);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load your game history",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            };

            loadData();
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            const fetchGameHistory = async () => {
                try {
                    const userId = localStorage.getItem("user_id");
                    const token = localStorage.getItem("token");

                    if (!userId || !token) {
                        console.error("User ID or token missing.");
                        return;
                    }

                    // Fetch lended games
                    const lendResponse = await axios.post(
                        API_URLS.FETCH_USER_LENDED_GAMES,
                        { userId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Fetch rented games
                    const rentResponse = await axios.post(
                        API_URLS.FETCH_RENTED_GAMES,
                        { userId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setLendHistory(lendResponse.data); // Store lend history
                    setRentHistory(rentResponse.data); // Store rent history
                } catch (error) {
                    console.error("Error fetching game history:", error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch your game history",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            };

            fetchGameHistory();
        }
    }, [user, loading, router]); // Runs when user state changes

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords don't match",
                variant: "destructive",
            });
            return;
        }

        setUpdating(true);
        try {
            await updatePassword(currentPassword, newPassword);
            toast({
                title: "Success",
                description: "Your password has been updated",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update password",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to logout",
                variant: "destructive",
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("userId", userId || "");
        formDataToSubmit.append("firstName", formData.firstName);
        formDataToSubmit.append("lastName", formData.lastName);

        if (image) {
            formDataToSubmit.append("image", image);
        }

        setLoading(true);
        try {
            const response = await axios.post(
                API_URLS.UPDATE_INFO,
                formDataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast({
                title: "Success",
                description: "Info Updated successfully",
            });

            localStorage.setItem("first_name", response.data.firstName);
            localStorage.setItem("last_name", response.data.lastName);
            localStorage.setItem("profilePicture", response.data.profilePictureUrl);

            setImagePreview(response.data.profilePictureUrl);
        } catch (error: any) {
            console.error(
                "Error Saving user Info:",
                error.response?.data || error.message
            );
            toast({
                title: "Error",
                description: "Error Updating details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <Card className="border-2 border-primary/10 shadow-lg">
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary overflow-hidden">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt={user.displayName || "User"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            user.displayName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label
                                            htmlFor="image-input"
                                            className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/80 transition-colors"
                                        >
                                            <CameraIcon className="h-5 w-5 text-white" />
                                            <input
                                                id="image-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                            {isEditing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleSave}
                                        disabled={loadingSave}
                                    >
                                        {loadingSave ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </p>
                                        <p className="font-medium">
                                            {firstName} {lastName}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="md:w-2/3">
                    <Tabs defaultValue="lend-history" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-8">
                            <TabsTrigger value="lend-history">Lend History</TabsTrigger>
                            <TabsTrigger value="rent-history">Rent History</TabsTrigger>
                            <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        </TabsList>
                        <TabsContent value="lend-history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lend History</CardTitle>
                                    <CardDescription>Games you have lent to others</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <GameHistoryList games={lendHistory} type="lend" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="rent-history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rent History</CardTitle>
                                    <CardDescription>Games you have rented from others</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <GameHistoryList games={rentHistory} type="rent" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="privacy">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your account password</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">
                                                Confirm New Password
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" disabled={updating}>
                                            {updating ? "Updating..." : "Update Password"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
