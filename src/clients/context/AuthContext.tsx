import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import type { AuthUser } from "aws-amplify/auth";

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkUser = async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCurrentUser();
            await fetchAuthSession(); // 세션 갱신
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkUser();

        const hubListener = Hub.listen("auth", ({ payload }) => {
            switch (payload.event) {
                case "signedIn":
                    checkUser();
                    break;
                case "signedOut":
                    setUser(null);
                    break;
            }
        });

        return () => {
            hubListener();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
