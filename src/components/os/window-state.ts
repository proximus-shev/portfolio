import { applications, type AppId } from "./registry";

export type Rect = { x: number; y: number; width: number; height: number };
export type WindowState = Rect & {
  id: AppId;
  status: "open" | "closed" | "minimized";
  maximized: boolean;
  expanded: boolean;
  z: number;
};
export type DesktopState = {
  windows: WindowState[];
  active: AppId;
  width: number;
  height: number;
  mobile: boolean;
};
export type Action =
  | {
      type: "resize";
      width: number;
      height: number;
      mobile: boolean;
      initial?: boolean;
    }
  | { type: "open"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "close" | "minimize" | "maximize"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "arrange" };

export function constrain(rect: Rect, width: number, height: number): Rect {
  const w = Math.min(rect.width, width);
  const h = Math.min(rect.height, height);
  return {
    width: w,
    height: h,
    x: Math.max(0, Math.min(rect.x, width - w)),
    y: Math.max(0, Math.min(rect.y, height - h)),
  };
}

function layout(id: AppId, width: number, height: number): Rect {
  const large = width >= 1050 && height >= 550;
  const gap = 16;
  const left = Math.round(width * 0.65);
  if (large) {
    if (id === "welcome")
      return {
        x: 0,
        y: 0,
        width: left,
        height: Math.round(height * 0.57) - gap,
      };
    if (id === "terminal")
      return {
        x: left + gap,
        y: 0,
        width: width - left - gap,
        height: Math.round(height * 0.36) - gap,
      };
    if (id === "projects")
      return {
        x: left + gap,
        y: Math.round(height * 0.36),
        width: width - left - gap,
        height: Math.round(height * 0.64),
      };
    if (id === "code")
      return {
        x: 0,
        y: Math.round(height * 0.57),
        width: Math.round(left * 0.57) - gap,
        height: Math.round(height * 0.43),
      };
    if (id === "stack")
      return {
        x: Math.round(left * 0.57),
        y: Math.round(height * 0.57),
        width: left - Math.round(left * 0.57),
        height: Math.round(height * 0.43),
      };
  }
  const w = Math.min(width, id === "welcome" ? 1000 : 900);
  const h = Math.min(height, id === "welcome" ? 560 : 670);
  return {
    x: Math.round((width - w) / 2),
    y: Math.round((height - h) / 2),
    width: w,
    height: h,
  };
}

export const initialDesktop: DesktopState = {
  width: 1300,
  height: 740,
  mobile: false,
  active: "welcome",
  windows: applications.map((app, i) => ({
    ...layout(app.id, 1300, 740),
    id: app.id,
    status: "closed" as const,
    maximized: false,
    expanded: false,
    z: app.id === "welcome" ? 10 : i + 1,
  })),
};

export function windowReducer(
  state: DesktopState,
  action: Action,
): DesktopState {
  // Pointer and focus events can arrive together. Avoid a second shell render.
  if (action.type === "focus" && state.active === action.id) return state;
  if (
    action.type === "resize" && !action.initial &&
    action.width === state.width && action.height === state.height &&
    action.mobile === state.mobile
  ) return state;
  // Home is the desktop surface. Keep open apps in the dock for restoration.
  if (action.type === "open" && action.id === "welcome") {
    return {
      ...state,
      active: "welcome",
      windows: state.windows.map((win) => ({
        ...win,
        status: win.status === "open" ? "minimized" as const : win.status,
      })),
    };
  }
  const front = Math.max(...state.windows.map((win) => win.z)) + 1;
  if (action.type === "resize" || action.type === "arrange") {
    const width = action.type === "resize" ? action.width : state.width;
    const height = action.type === "resize" ? action.height : state.height;
    const mobile = action.type === "resize" ? action.mobile : state.mobile;
    const arrange =
      action.type === "arrange" || (action.type === "resize" && action.initial);
    return {
      ...state,
      width,
      height,
      mobile,
      windows: state.windows.map((win) => ({
        ...win,
        ...(arrange && !win.expanded
          ? layout(win.id, width, height)
          : constrain(win, width, height)),
        ...(arrange &&
        win.id !== "welcome" &&
        !win.expanded &&
        (width < 1050 || height < 550)
          ? { status: "closed" as const }
          : {}),
      })),
    };
  }
  const win = state.windows.find((item) => item.id === action.id)!;
  const next = state.windows.map((item) => {
    if (item.id !== action.id) return item;
    switch (action.type) {
      case "open": {
        const w = Math.min(state.width, action.id === "terminal" ? 720 : 1000);
        const h = Math.min(state.height, 680);
        const expand = !item.expanded;
        return {
          ...item,
          status: "open" as const,
          z: front,
          expanded: true,
          ...(expand
            ? {
                x: (state.width - w) / 2,
                y: (state.height - h) / 2,
                width: w,
                height: h,
              }
            : {}),
        };
      }
      case "focus":
        return { ...item, z: front };
      case "close":
        return { ...item, status: "closed" as const };
      case "minimize":
        return { ...item, status: "minimized" as const };
      case "maximize":
        return { ...item, maximized: !item.maximized, z: front };
      case "move":
        return {
          ...item,
          ...constrain(
            { ...item, x: action.x, y: action.y },
            state.width,
            state.height,
          ),
        };
    }
  });
  const active =
    action.type === "close" || action.type === "minimize"
      ? ([...next]
          .filter((item) => item.status === "open")
          .sort((a, b) => b.z - a.z)[0]?.id ?? "welcome")
      : action.type === "move"
        ? state.active
        : win.id;
  return { ...state, windows: next, active };
}
