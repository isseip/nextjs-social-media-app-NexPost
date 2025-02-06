import kyInstance from "@/lib/ky";
import { useEffect, useRef, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../SessionProvider";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const chatClientRef = useRef<StreamChat | null>(null); // ✅ Store chatClient reference

  useEffect(() => {
    let cleanupCalled = false;

    async function initializeClient() {
      try {
        if (chatClientRef.current) {
          return; // Avoid re-initialization
        }

        // Create Stream client instance
        const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

        // First get the token
        const { token } = await kyInstance.get("/api/get-token").json<{ token: string }>();

        if (!token) {
          throw new Error("Failed to get token");
        }

        // Then connect the user
        await client.connectUser(
          {
            id: user.id,
            username: user.username,
            name: user.displayName,
            image: user.avatarUrl,
          },
          token // Pass the token directly
        );

        console.log("Successfully connected user to Stream:", user.id);

        if (!cleanupCalled) {
          chatClientRef.current = client; // ✅ Store client in ref
          setChatClient(client);
        }
      } catch (error) {
        console.error("Error initializing Stream client:", error);
        if (!cleanupCalled) {
          setChatClient(null);
        }
      }
    }

    initializeClient();

    return () => {
      cleanupCalled = true;
      if (chatClientRef.current) {
        chatClientRef.current
          .disconnectUser()
          .then(() => console.log("Successfully disconnected user"))
          .catch((error) => console.error("Error disconnecting user:", error));
        chatClientRef.current = null; // ✅ Clear ref
      }
      setChatClient(null);
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]); // ✅ No chatClient dependency

  return chatClient;
}
