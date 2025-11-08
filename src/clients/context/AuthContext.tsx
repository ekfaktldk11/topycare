import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import type { AuthUser } from "aws-amplify/auth";

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    isAdmin: boolean; // isAdmin 상태 추가
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAdmin: false, // 기본값은 false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // isAdmin 상태 관리

    const checkUser = async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();
            const groupsFromId = session.tokens?.idToken?.payload[
                "cognito:groups"
            ] as string[] | undefined;
            const groupsFromAccess = session.tokens?.accessToken?.payload[
                "cognito:groups"
            ] as string[] | undefined;
            const groups = groupsFromId ?? groupsFromAccess;

            if (groups?.includes("ADMIN")) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            setUser(currentUser);
        } catch (error) {
            setUser(null);
            setIsAdmin(false);
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
                    setIsAdmin(false); // 로그아웃 시 isAdmin도 false로 설정
                    break;
            }
        });

        return () => {
            hubListener();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
