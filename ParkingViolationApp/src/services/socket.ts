import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();
    const socketUrl = debuggerHost
      ? `http://${debuggerHost}:5000`
      : "http://localhost:5000";

    this.socket = io(socketUrl, {
      transports: ["websocket"],
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      this.emit("connection_status", { connected: true });
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
      this.emit("connection_status", { connected: false });
    });

    this.socket.on("connected", (data) => {
      console.log("Server message:", data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    } else {
      this.listeners.delete(event);
    }

    if (this.socket) {
      this.socket.off(event, callback as any);
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  private emitToListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }
}

export default new SocketService();
