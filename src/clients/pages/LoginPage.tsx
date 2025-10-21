import { useState, useEffect } from "react";
import type { JSX } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import { signIn, signOut, signUp, confirmSignUp } from "aws-amplify/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ...existing code...
export default function LoginPage(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const { user, isLoading: isAuthLoading } = useAuth();
    const [error, setError] = useState<string>("");
    const [info, setInfo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [showConfirmStep, setShowConfirmStep] = useState<boolean>(false);
    const [confirmCode, setConfirmCode] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); // 로그인된 사용자는 홈으로 리디렉션
        }
    }, [user, navigate]);

    const handleSignIn = async () => {
        setError("");
        setInfo("");
        setLoading(true);
        try {
            await signIn({ username: email, password });
            // AuthProvider의 Hub listener가 상태를 업데이트하고 리디렉션합니다.
        } catch (err: any) {
            setError(err?.message ?? "Sign in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setLoading(true);
            await signOut();
        } catch (err: any) {
            setError(err?.message ?? "Sign out failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setError("");
        setInfo("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await signUp({
                username: email,
                password,
                options: { userAttributes: { email, name } },
            });
            setShowConfirmStep(true);
            setInfo(
                "Verification code sent to your email. Enter code to confirm."
            );
        } catch (err: any) {
            setError(err?.message ?? "Sign up failed");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSignUp = async () => {
        setError("");
        setInfo("");
        setLoading(true);
        try {
            await confirmSignUp({
                username: email,
                confirmationCode: confirmCode,
            });
            setInfo("Sign up confirmed. You can now sign in.");
            setShowConfirmStep(false);
            setIsSignUp(false);
            // optionally clear fields
            setPassword("");
            setConfirmPassword("");
            setConfirmCode("");
        } catch (err: any) {
            setError(err?.message ?? "Confirmation failed");
        } finally {
            setLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <Container maxWidth="xs" sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (user) {
        // 이 부분은 useEffect 리디렉션으로 인해 거의 보이지 않지만, 만약을 위해 남겨둡니다.
        return (
            <Container maxWidth="xs" sx={{ mt: 8 }}>
                <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                        Welcome, {user.username ?? "User"}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSignOut}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : "Sign out"}
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (isSignUp) {
                        // if confirmation step visible, call confirm; otherwise start sign up
                        showConfirmStep
                            ? handleConfirmSignUp()
                            : handleSignUp();
                    } else {
                        handleSignIn();
                    }
                }}
            >
                <Typography variant="h5" align="center">
                    {isSignUp
                        ? showConfirmStep
                            ? "Confirm Sign up"
                            : "Sign up"
                        : "Sign in"}
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}
                {info && <Alert severity="info">{info}</Alert>}

                {!showConfirmStep && (
                    <>
                        {isSignUp && (
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                                autoComplete="name"
                            />
                        )}

                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            autoComplete="email"
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete={
                                isSignUp ? "new-password" : "current-password"
                            }
                        />

                        {isSignUp && (
                            <TextField
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                fullWidth
                                autoComplete="new-password"
                            />
                        )}
                    </>
                )}

                {showConfirmStep && (
                    <>
                        <TextField
                            label="Confirmation Code"
                            value={confirmCode}
                            onChange={(e) => setConfirmCode(e.target.value)}
                            required
                            fullWidth
                        />
                    </>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading
                        ? isSignUp
                            ? showConfirmStep
                                ? "Confirming…"
                                : "Signing up…"
                            : "Signing in…"
                        : isSignUp
                          ? showConfirmStep
                              ? "Confirm"
                              : "Sign up"
                          : "Sign in"}
                </Button>

                <Box textAlign="center">
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            setError("");
                            setInfo("");
                            setIsSignUp((s) => !s);
                            setShowConfirmStep(false);
                        }}
                    >
                        {isSignUp
                            ? "Have an account? Sign in"
                            : "No account? Sign up"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
