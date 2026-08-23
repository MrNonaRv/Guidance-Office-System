import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c0b630d4"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c0b630d4"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"]; const useRef = __vite__cjsImport1_react["useRef"]; const useEffect = __vite__cjsImport1_react["useEffect"];
import { Outlet, useNavigate, useSearchParams } from "/node_modules/.vite/deps/react-router-dom.js?v=c0b630d4";
import { cn } from "/src/lib/utils.ts";
import {
  User,
  Upload,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  View,
  FileText,
  PenTool,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  Edit
} from "/node_modules/.vite/deps/lucide-react.js?v=c0b630d4";
import { db } from "/src/lib/db.ts";
import { motion } from "/node_modules/.vite/deps/motion_react.js?v=c0b630d4";
import { signInWithGoogle, logOut } from "/src/lib/firebase.ts";
export function StudentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const handleGoogleLogin = async () => {
    try {
      const fbUser = await signInWithGoogle();
      let user = await db.users.findByEmail(fbUser.email || "");
      if (!user) {
        user = {
          id: fbUser.uid,
          email: fbUser.email || "",
          firstName: fbUser.displayName?.split(" ")[0] || "User",
          lastName: fbUser.displayName?.split(" ").slice(1).join(" ") || "",
          role: "student"
        };
        await db.users.set(user.id, user);
      }
      sessionStorage.setItem("studentAuth", "true");
      sessionStorage.setItem("studentUser", JSON.stringify(user));
      navigate("/student/dashboard");
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        setError("Sign-in cancelled. Please try again.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (err?.code === "auth/unauthorized-domain") {
        setError("Domain not authorized in Firebase. Add this URL to Firebase Auth settings.");
      } else {
        console.error("Student login error", err);
        setError("Failed to sign in. If previewing, try opening in a new tab.");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const user = await db.users.findByEmail(email);
      if (user && user.password === password) {
        sessionStorage.setItem("studentAuth", "true");
        sessionStorage.setItem("studentUser", JSON.stringify(user));
        navigate("/student/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } else {
      const existing = await db.users.findByEmail(email);
      if (existing) {
        setError("Email already exists");
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        firstName,
        lastName,
        role: "student"
      };
      await db.users.set(newUser.id, newUser);
      sessionStorage.setItem("studentAuth", "true");
      sessionStorage.setItem("studentUser", JSON.stringify(newUser));
      navigate("/student/dashboard");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-[url('/BI.png')] bg-cover bg-center p-4", children: /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: "spring", stiffness: 100, damping: 20 },
      className: "relative bg-[#a5d8ff] p-8 rounded-[32px] shadow-2xl w-full max-w-[380px] text-center",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mx-auto h-16 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxDEV("img", { src: "/capsu-logo.png", alt: "Logo", className: "h-full object-contain" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 98,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("h1", { className: "text-lg font-bold text-[#0f2e60] mb-3 leading-snug", children: [
          "Web-Based Scholarship Submission",
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 101,
            columnNumber: 108
          }, this),
          "Alert System"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 101,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "inline-block bg-[#5daef5] text-white px-5 py-1 rounded-full text-[11px] font-semibold mb-6 shadow-sm tracking-wide", children: "Student Portal" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 103,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex bg-white/40 backdrop-blur-sm rounded-full p-1 mb-5 shadow-sm border border-white/40", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all", !isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50"),
              onClick: () => setIsLogin(false),
              children: "Register"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 108,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all", isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50"),
              onClick: () => {
                setIsLogin(true);
                setError("");
              },
              children: "Log In"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 115,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 107,
          columnNumber: 9
        }, this),
        error && /* @__PURE__ */ jsxDEV("div", { className: "text-red-500 text-xs text-center mb-2", children: error }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 124,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: handleGoogleLogin,
            className: "w-full bg-white text-gray-700 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center justify-center gap-2 border border-white/60 mb-4",
            children: [
              /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsxDEV("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 131,
                  columnNumber: 56
                }, this),
                /* @__PURE__ */ jsxDEV("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 131,
                  columnNumber: 202
                }, this),
                /* @__PURE__ */ jsxDEV("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 131,
                  columnNumber: 362
                }, this),
                /* @__PURE__ */ jsxDEV("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 131,
                  columnNumber: 514
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 131,
                columnNumber: 11
              }, this),
              "Continue with Google"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 126,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "h-px bg-[#0f2e60]/10 flex-1" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 136,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-[#0f2e60]/40 font-bold uppercase tracking-wider", children: "Or" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 137,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "h-px bg-[#0f2e60]/10 flex-1" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 138,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 135,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("form", { className: "space-y-3", onSubmit: handleSubmit, children: [
          !isLogin && /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1", children: "First Name" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 145,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), required: !isLogin, className: "w-full px-4 py-2 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 146,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 144,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1", children: "Last Name" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 149,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), required: !isLogin, className: "w-full px-4 py-2 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 150,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 148,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1", children: "Email" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 156,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 157,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 155,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-left relative", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1", children: "Password" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 161,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 163,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("button", { type: "button", className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxDEV(View, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 165,
                columnNumber: 17
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 164,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 162,
              columnNumber: 13
            }, this),
            isLogin ? /* @__PURE__ */ jsxDEV("div", { className: "text-right mt-1", children: /* @__PURE__ */ jsxDEV("a", { href: "#", className: "text-[11px] text-[#0f2e60]/70 hover:text-[#0f2e60] hover:underline px-1", children: "Forgot Password?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 170,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 169,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-[#0f2e60]/50 mt-1 px-1", children: "At least 8 characters" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 173,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 160,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors shadow-md shadow-blue-900/20 text-sm", children: isLogin ? "Log In" : "Create Account" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 177,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 141,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 92,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "/app/applet/src/pages/student/index.tsx",
    lineNumber: 91,
    columnNumber: 5
  }, this);
}
export function StudentLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem("studentUser");
    if (sessionStr) {
      setUser(JSON.parse(sessionStr));
    }
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#f4f7fb] font-sans", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-[#2b64b1] text-white py-3 px-8 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxDEV("img", { src: "/capsu-logo.png", alt: "CAPSU Logo", className: "w-10 h-10 object-contain" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 205,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-[17px] font-bold tracking-tight", children: "Web-Based Scholarship Submission Alert System" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 208,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[13px] font-semibold text-blue-100", children: "Student Portal" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 209,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 203,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 mt-4 md:mt-0", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full shadow-sm", children: [
          /* @__PURE__ */ jsxDEV(User, { className: "w-4 h-4 text-white" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 215,
            columnNumber: 13
          }, this),
          user?.email || "student@gmail.com"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: async () => {
          await logOut();
          sessionStorage.removeItem("studentAuth");
          sessionStorage.removeItem("studentUser");
          navigate("/student/login");
        }, className: "text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-6 py-2 rounded-full shadow-sm flex items-center gap-2", children: "Log out" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 213,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 202,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "w-full", children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 230,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 229,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/student/index.tsx",
    lineNumber: 200,
    columnNumber: 5
  }, this);
}
export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const availableSemesters = ["1st"];
  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem("studentUser");
    if (sessionStr) {
      setUser(JSON.parse(sessionStr));
    }
  }, []);
  const toggleDropdown = (sem) => {
    if (!availableSemesters.includes(sem)) return;
    setOpenDropdown((prev) => prev === sem ? null : sem);
  };
  const handleFileChange = (e, key) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };
  const handleSubmit = async (sem) => {
    const rfKey = `${sem}_rf`;
    const gwaKey = `${sem}_gwa`;
    if (!files[rfKey] || !files[gwaKey]) {
      alert("Please upload both the Registration Form (RF) and General Weighted Average (GWA) documents.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4e3);
    setFiles((prev) => ({ ...prev, [rfKey]: null, [gwaKey]: null }));
    setOpenDropdown(null);
    setIsSubmitting(false);
  };
  const renderFileButton = (key) => {
    const file = files[key];
    if (file) {
      return /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#eef2ff] px-4 py-2 rounded-md text-[11px] font-semibold hover:bg-[#e0e7ff] transition-colors cursor-pointer w-[220px] overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxDEV(ImageIcon, { className: "w-3.5 h-3.5 shrink-0 text-[#1e3a8a]" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 294,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "truncate", children: file.name }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 295,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "file", className: "hidden", accept: ".pdf,.png,.jpg,.jpeg", onChange: (e) => handleFileChange(e, key) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 296,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 293,
        columnNumber: 9
      }, this);
    }
    return /* @__PURE__ */ jsxDEV("label", { className: "flex items-center justify-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#f8fafc] px-6 py-2 rounded-md text-[11px] font-bold hover:bg-[#e2e8f0] transition-colors cursor-pointer w-[220px] shadow-sm", children: [
      /* @__PURE__ */ jsxDEV(Upload, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 302,
        columnNumber: 9
      }, this),
      " Add File",
      /* @__PURE__ */ jsxDEV("input", { type: "file", className: "hidden", accept: ".pdf,.png,.jpg,.jpeg", onChange: (e) => handleFileChange(e, key) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 303,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 301,
      columnNumber: 7
    }, this);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-10 max-w-[900px] mx-auto mt-6 pb-32 relative", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-[#3b82f6] to-[#1e5088] rounded-[10px] px-12 py-10 text-white shadow-md mx-6 md:mx-0", children: /* @__PURE__ */ jsxDEV("h2", { className: "text-[32px] font-bold tracking-tight", children: [
      "Hello, ",
      user ? `${user.firstName} ${user.lastName}` : "Anna Santos",
      "!"
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 311,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 310,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 px-6 md:px-0", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px]", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-[22px] font-bold text-[#0c2340]", children: "Scholarship Requirements" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 318,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mt-1 text-sm md:text-base", children: [
            "Fill up a scholarship form and upload the required documents ",
            /* @__PURE__ */ jsxDEV("span", { className: "italic font-medium font-serif text-gray-500", children: "(for new students only)" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 319,
              columnNumber: 129
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 319,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 317,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => navigate("/student/submission"),
            className: "px-12 py-3.5 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm w-auto min-w-[140px]",
            children: "Enter"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 321,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 316,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: cn("relative", openDropdown === "1st" ? "z-50" : "z-10"), children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px] relative z-20", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { className: cn("text-[22px] font-bold", availableSemesters.includes("1st") ? "text-[#0c2340]" : "text-[#6b7280]"), children: [
              "1st Semester ",
              /* @__PURE__ */ jsxDEV("span", { className: cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes("1st") ? "text-[#0c2340]" : "text-[#9ca3af]"), children: "(2026-2027)" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 334,
                columnNumber: 30
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 333,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mt-1 text-sm md:text-base", children: [
              "Upload the required documents ",
              /* @__PURE__ */ jsxDEV("span", { className: "italic font-medium font-serif text-gray-500", children: "(for current students)" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 336,
                columnNumber: 100
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 336,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 332,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => toggleDropdown("1st"),
              disabled: !availableSemesters.includes("1st"),
              className: cn(
                "px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border w-auto min-w-[140px] transition-colors",
                !availableSemesters.includes("1st") ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" : openDropdown === "1st" ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]" : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              ),
              children: [
                "Submit",
                openDropdown === "1st" ? /* @__PURE__ */ jsxDEV(ChevronUp, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 352,
                  columnNumber: 17
                }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 354,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 338,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 331,
          columnNumber: 11
        }, this),
        openDropdown === "1st" && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-[90px] right-4 w-full max-w-[650px] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-300 p-8 pt-10 z-10 animate-in fade-in slide-in-from-top-4 duration-200", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-5", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-[#0c2340] text-[18px] leading-tight", children: "RF" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 363,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] text-[15px]", children: "Registration Form" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 364,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 362,
              columnNumber: 17
            }, this),
            renderFileButton("1st_rf")
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 361,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-8", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-[#0c2340] text-[18px] leading-tight", children: "GWA" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 371,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] text-[15px]", children: "General Weighted Average" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 372,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 370,
              columnNumber: 17
            }, this),
            renderFileButton("1st_gwa")
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 369,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSubmit("1st"),
              disabled: isSubmitting,
              className: "w-full bg-[#2b4c8a] text-white py-3.5 rounded-lg font-bold text-[15px] hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2",
              children: isSubmitting ? /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-5 h-5 animate-spin" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 382,
                columnNumber: 33
              }, this) : "Submit"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 377,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 360,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 330,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: cn("relative", openDropdown === "2nd" ? "z-50" : "z-10"), children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px] relative z-20", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { className: cn("text-[22px] font-bold", availableSemesters.includes("2nd") ? "text-[#0c2340]" : "text-[#6b7280]"), children: [
              "2nd Semester ",
              /* @__PURE__ */ jsxDEV("span", { className: cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes("2nd") ? "text-[#0c2340]" : "text-[#9ca3af]"), children: "(2026-2027)" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 393,
                columnNumber: 30
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 392,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mt-1 text-sm md:text-base", children: [
              "Upload the required documents ",
              /* @__PURE__ */ jsxDEV("span", { className: "italic font-medium font-serif text-gray-500", children: "(for current students)" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 395,
                columnNumber: 100
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 395,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 391,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => toggleDropdown("2nd"),
              disabled: !availableSemesters.includes("2nd"),
              className: cn(
                "px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border w-auto min-w-[140px] transition-colors",
                !availableSemesters.includes("2nd") ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" : openDropdown === "2nd" ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]" : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              ),
              children: [
                "Submit",
                openDropdown === "2nd" ? /* @__PURE__ */ jsxDEV(ChevronUp, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 411,
                  columnNumber: 17
                }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 413,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 397,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 390,
          columnNumber: 11
        }, this),
        openDropdown === "2nd" && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-[90px] right-4 w-full max-w-[650px] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-300 p-8 pt-10 z-10 animate-in fade-in slide-in-from-top-4 duration-200", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-5", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-[#0c2340] text-[18px] leading-tight", children: "RF" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 422,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] text-[15px]", children: "Registration Form" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 423,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 421,
              columnNumber: 17
            }, this),
            renderFileButton("2nd_rf")
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 420,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-8", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-[#0c2340] text-[18px] leading-tight", children: "GWA" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 430,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] text-[15px]", children: "General Weighted Average" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 431,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 429,
              columnNumber: 17
            }, this),
            renderFileButton("2nd_gwa")
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 428,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSubmit("2nd"),
              disabled: isSubmitting,
              className: "w-full bg-[#2b4c8a] text-white py-3.5 rounded-lg font-bold text-[15px] hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2",
              children: isSubmitting ? /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-5 h-5 animate-spin" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 441,
                columnNumber: 33
              }, this) : "Submit"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 436,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 419,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 389,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 314,
      columnNumber: 7
    }, this),
    showToast && /* @__PURE__ */ jsxDEV("div", { className: "fixed bottom-10 left-10 bg-[#bbf7d0] border border-[#86efac] px-6 py-3.5 rounded-full shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-6 h-6 bg-[#16a34a] rounded-full flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4 text-white", strokeWidth: 4 }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 452,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 451,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[#166534] font-bold text-[14px]", children: "Successfully submitted!" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 454,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 450,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/student/index.tsx",
    lineNumber: 309,
    columnNumber: 5
  }, this);
}
function DigitalSignaturePad({
  value,
  onChange,
  studentName
}) {
  const [mode, setMode] = useState("draw");
  const [typedName, setTypedName] = useState(studentName || "");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  useEffect(() => {
    if (mode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#003884";
        ctx.lineWidth = 2.5;
      }
    }
  }, [mode]);
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange("");
  };
  const generateTypedSignature = (text) => {
    setTypedName(text);
    if (!text.trim()) {
      onChange("");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic bold 34px "Brush Script MT", "Caveat", "Dancing Script", cursive, Georgia, serif';
      ctx.fillStyle = "#003884";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 200, 55);
      ctx.beginPath();
      ctx.moveTo(50, 90);
      ctx.quadraticCurveTo(200, 102, 350, 85);
      ctx.strokeStyle = "#003884";
      ctx.lineWidth = 2;
      ctx.stroke();
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };
  const handleUploadSignature = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-[#f8faff] border-2 border-blue-100 rounded-2xl p-6 space-y-4 shadow-sm", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-bold text-[#0f2e60] flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(PenTool, { className: "w-4 h-4 text-[#1864db]" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 582,
            columnNumber: 13
          }, this),
          "Applicant Digital Signature"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 581,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Sign digitally using your mouse/touch, upload a signature image, or type your name." }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 585,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 580,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-200", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setMode("draw"),
            className: cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              mode === "draw" ? "bg-[#1864db] text-white shadow-xs" : "text-gray-600 hover:text-blue-900"
            ),
            children: "Draw"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 590,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => {
              setMode("type");
              if (typedName) generateTypedSignature(typedName);
            },
            className: cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              mode === "type" ? "bg-[#1864db] text-white shadow-xs" : "text-gray-600 hover:text-blue-900"
            ),
            children: "Type"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 600,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setMode("upload"),
            className: cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              mode === "upload" ? "bg-[#1864db] text-white shadow-xs" : "text-gray-600 hover:text-blue-900"
            ),
            children: "Upload"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 613,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 589,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 579,
      columnNumber: 7
    }, this),
    mode === "draw" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative border-2 border-dashed border-blue-200 bg-white rounded-xl overflow-hidden cursor-crosshair shadow-inner", children: [
        /* @__PURE__ */ jsxDEV(
          "canvas",
          {
            ref: canvasRef,
            width: 500,
            height: 140,
            onPointerDown: startDrawing,
            onPointerMove: draw,
            onPointerUp: stopDrawing,
            onPointerLeave: stopDrawing,
            className: "w-full h-[140px] touch-none block"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 630,
            columnNumber: 13
          },
          this
        ),
        !hasDrawn && !value && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-sm font-medium", children: "Sign here with mouse, finger, or stylus" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 641,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 629,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "Draw your legal signature inside the box" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 647,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: clearCanvas,
            className: "text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline",
            children: [
              /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 653,
                columnNumber: 15
              }, this),
              " Clear Signature"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 648,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 646,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 628,
      columnNumber: 9
    }, this),
    mode === "type" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-gray-700 mb-1.5", children: "Type your full legal name" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 663,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            value: typedName,
            onChange: (e) => generateTypedSignature(e.target.value),
            placeholder: "e.g. Juan D. Dela Cruz",
            className: "w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 664,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 662,
        columnNumber: 11
      }, this),
      value && /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-white border border-blue-100 rounded-xl flex items-center justify-center min-h-[100px]", children: /* @__PURE__ */ jsxDEV("img", { src: value, alt: "Typed Signature Preview", className: "max-h-20 object-contain" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 674,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 673,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 661,
      columnNumber: 9
    }, this),
    mode === "upload" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "border-2 border-dashed border-blue-200 bg-white rounded-xl p-6 text-center hover:bg-blue-50/50 transition-colors relative group", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: handleUploadSignature,
            className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 684,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxDEV(Upload, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 691,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 690,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-gray-800", children: "Upload signature image file" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 693,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "PNG, JPG, or JPEG with clean background" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 694,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 683,
        columnNumber: 11
      }, this),
      value && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-white border border-blue-100 rounded-xl flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("img", { src: value, alt: "Signature Preview", className: "h-12 w-28 object-contain border border-gray-100 rounded p-1 bg-gray-50" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 699,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-green-700 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-3.5 h-3.5" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 701,
              columnNumber: 19
            }, this),
            " Signature Attached"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 700,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 698,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => onChange(""),
            className: "text-xs text-red-600 hover:text-red-700 font-bold",
            children: "Remove"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 704,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 697,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 682,
      columnNumber: 9
    }, this),
    value ? /* @__PURE__ */ jsxDEV("div", { className: "bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-green-800 font-bold", children: [
        /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "w-4 h-4 text-green-600" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 720,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: "Digital Signature Verified & Affixed" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 721,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 719,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-gray-500 font-mono text-[11px]", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 723,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 718,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-800 font-medium", children: [
      /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-4 h-4 text-amber-600 shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 729,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Please affix your signature above before submitting your application." }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 730,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 728,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/student/index.tsx",
    lineNumber: 578,
    columnNumber: 5
  }, this);
}
export function StudentSubmissionForm() {
  const [scholarships, setScholarships] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scholarshipId = searchParams.get("scholarshipId");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [formData, setFormData] = useState({
    photo2x2: "",
    familyName: "",
    middleName: "",
    firstName: "",
    birthdate: "",
    age: "",
    sex: "",
    yearLevel: "",
    course: "",
    section: "",
    contactNo: "",
    email: "",
    permanentAddress: "",
    fatherName: "",
    fatherOccupation: "",
    fatherContact: "",
    motherName: "",
    motherOccupation: "",
    motherContact: "",
    guardianName: "",
    guardianOccupation: "",
    guardianContact: "",
    // Page 2
    highestEducationalAttainment: "",
    monthlyIncome: "",
    firstInFamilyToAttendCollege: "",
    livingCondition: "",
    livingConditionOthers: "",
    typeOfHousing: "",
    typeOfHousingOthers: "",
    // Page 3
    accessToResources: [],
    workingStudent: "",
    studentClassification: [],
    studentClassificationOthers: "",
    // Page 4
    typeOfWorkOrSourceOfIncome: "",
    specialNeedsOrDisability: "",
    pdlReason: "",
    scholarshipCategoryType: "",
    // A. Internally-Funded, B. Externally-Funded
    scholarshipCategory: "",
    scholarshipCategoryOthers: "",
    // Page 5
    congressionalDistrict: "",
    oneTownOneScholar: "",
    tulongDunong: "",
    lguContactPerson: "",
    dswdMunicipality: "",
    dswdContactPerson: "",
    dswdDesignation: "",
    dswdOthers: ""
  });
  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };
  const [files, setFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const handleCategoryFileUpload = (category, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
        const newFileObj = {
          id: `file-${Date.now()}`,
          name: file.name,
          category,
          type: file.type,
          size: sizeStr,
          data: dataUrl,
          verified: false,
          status: "Pending"
        };
        setFiles((prev) => {
          const filtered = prev.filter((f) => f.category !== category);
          return [...filtered, newFileObj];
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const renderFileUpload = (category) => {
    const file = files.find((f) => f.category === category);
    return /* @__PURE__ */ jsxDEV("div", { className: "border border-gray-200 rounded-lg p-6 bg-gray-50 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-[#0c2340] mb-1", children: category }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 856,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: "Please upload a clear scanned copy or photo." }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 857,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 855,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "file",
            id: `upload-${category.replace(/[^a-zA-Z]/g, "")}`,
            className: "hidden",
            onChange: (e) => handleCategoryFileUpload(category, e)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 861,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: `upload-${category.replace(/[^a-zA-Z]/g, "")}`,
            className: cn(
              "cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm",
              file ? "bg-[#dbeafe] text-[#1e3a8a] border border-[#bfdbfe]" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            ),
            children: file ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(ImageIcon, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 876,
                columnNumber: 18
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "max-w-[150px] truncate", children: file.name }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 877,
                columnNumber: 18
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 875,
              columnNumber: 16
            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Upload, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 881,
                columnNumber: 18
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "Add File" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 882,
                columnNumber: 18
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 880,
              columnNumber: 16
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 867,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 860,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 854,
      columnNumber: 7
    }, this);
  };
  const renderCard = (category, title, subtitle) => {
    const file = files.find((f) => f.category === category);
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          className: "w-[280px] h-[190px] bg-[#f2f6ff] border-2 border-dashed border-[#5d7bb5] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#e6edfe] transition-colors relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "file",
                className: "hidden",
                accept: "image/*,.pdf",
                onChange: (e) => handleCategoryFileUpload(category, e)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 899,
                columnNumber: 11
              },
              this
            ),
            file ? file.data.startsWith("data:image") ? /* @__PURE__ */ jsxDEV("img", { src: file.data, alt: title, className: "w-full h-full object-cover" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 907,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center p-4", children: [
              /* @__PURE__ */ jsxDEV(FileText, { className: "w-12 h-12 text-[#5d7bb5] mx-auto mb-2" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 910,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-[#1e3a8a] break-all", children: file.name }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 911,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 909,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV("svg", { width: "64", height: "64", viewBox: "0 0 64 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsxDEV("rect", { width: "64", height: "64", rx: "10", fill: "#889fc9" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 916,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("path", { d: "M12 48L28 28L38 40L50 24L52 48H12Z", fill: "white" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 917,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 915,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 896,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "mt-5 text-center", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-bold text-[15px]", children: title }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 922,
          columnNumber: 11
        }, this),
        subtitle && /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-bold italic text-[12px] mt-0.5", children: subtitle }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 923,
          columnNumber: 24
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 921,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 895,
      columnNumber: 7
    }, this);
  };
  const [user, setUser] = useState(null);
  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem("studentUser");
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        firstName: parsedUser.firstName || "",
        familyName: parsedUser.lastName || "",
        email: parsedUser.email || ""
      }));
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photo2x2: event.target?.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const validateStep1 = () => {
    const required = [
      "photo2x2",
      "familyName",
      "middleName",
      "firstName",
      "birthdate",
      "age",
      "sex",
      "yearLevel",
      "course",
      "section",
      "contactNo",
      "email",
      "permanentAddress",
      "fatherName",
      "fatherOccupation",
      "fatherContact",
      "motherName",
      "motherOccupation",
      "motherContact",
      "guardianName",
      "guardianOccupation",
      "guardianContact"
    ];
    let valid = true;
    for (const key of required) {
      if (!formData[key]) {
        valid = false;
      }
    }
    return valid;
  };
  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) {
        setShowErrors(true);
        return;
      }
    } else if (step === 2) {
      const hasId = files.some((f) => f.category === "Valid Student ID");
      const hasRf = files.some((f) => f.category === "Registration Form (RF)");
      const hasGwa = files.some((f) => f.category === "General Weighted Average (GWA)");
      if (!hasId || !hasRf || !hasGwa) {
        alert("Please upload all required files (Student ID, RF, and GWA) before proceeding.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo(0, 0);
  };
  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };
  const getErrorProps = (fieldName, defaultText = "This field is required.") => {
    const isError = showErrors && !formData[fieldName];
    return {
      className: cn(
        "w-full px-3 py-2 bg-white border rounded-sm text-sm text-[#0c2340] focus:outline-none focus:ring-1 focus:ring-blue-500",
        isError ? "border-red-500" : "border-gray-300"
      ),
      errorMsg: isError ? defaultText : null
    };
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-5xl mx-auto space-y-8 mt-6 pb-20", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex justify-center items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: cn(
          "w-16 h-16 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-3 transition-colors",
          step > 1 ? "bg-[#10b981] text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]" : "bg-[#2563eb] text-white"
        ), children: step > 1 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-full w-8 h-8 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Check, { className: "w-5 h-5 text-[#10b981]", strokeWidth: 4 }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1029,
          columnNumber: 18
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1028,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV(Edit, { className: "w-7 h-7" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1032,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1023,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: cn(
          "text-[10px] font-bold uppercase tracking-wide",
          step > 1 ? "text-[#10b981]" : "text-[#0c2340]"
        ), children: "Student Information" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1035,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1022,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "w-24 h-[2px] bg-gray-300 mb-6" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1041,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: cn(
          "w-16 h-16 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-3 transition-colors",
          step >= 2 ? "bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.4)]" : "bg-[#3b82f6] text-white"
        ), children: /* @__PURE__ */ jsxDEV(FileText, { className: "w-7 h-7" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1049,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1045,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[#0c2340] text-[10px] font-bold uppercase tracking-wide", children: "Upload Files" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1051,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1044,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "w-24 h-[2px] bg-gray-300 mb-6" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1054,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: cn(
          "w-16 h-16 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-3 transition-colors",
          step >= 3 ? "bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.4)]" : "bg-[#3b82f6] text-white"
        ), children: /* @__PURE__ */ jsxDEV(Edit, { className: "w-7 h-7" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1062,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1058,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[#0c2340] text-[10px] font-bold uppercase tracking-wide", children: "Review" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1064,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1057,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 1020,
      columnNumber: 7
    }, this),
    step === 1 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden border-t-[8px] border-t-yellow-400 border border-gray-200 text-center pb-6", children: /* @__PURE__ */ jsxDEV("div", { className: "pt-8 pb-4", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-[28px] font-bold font-serif text-[#000000]", children: "Scholarship Record Form" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1074,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 text-sm font-serif mt-2 px-10", children: [
          "Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as",
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1076,
            columnNumber: 140
          }, this),
          "Data Privacy Act of 2012"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1075,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1073,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1072,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-[#fffbeb] border border-[#fcd34d] rounded-md px-6 py-3 text-center", children: /* @__PURE__ */ jsxDEV("p", { className: "text-[#d97706] text-xs font-semibold", children: "Please fill out all required fields accurately and completely. This form will be reviewed by the Guidance Office prior to processing." }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1082,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1081,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-[#1e3a8a] rounded-lg py-3 text-center shadow-sm", children: /* @__PURE__ */ jsxDEV("h2", { className: "text-white font-bold text-sm tracking-wider uppercase", children: "Student Demographics" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1088,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1087,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg border border-[#94a3b8] overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-[#dbeafe] px-4 py-2 flex items-center gap-3 border-b border-[#94a3b8]", children: [
          /* @__PURE__ */ jsxDEV(User, { className: "w-4 h-4 text-[#1e3a8a]" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1094,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-[#1e3a8a] font-bold text-xs uppercase", children: "A. Personal Information & B. Family Background" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1095,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1093,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex flex-col md:flex-row gap-8", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxDEV("label", { className: cn(
              "w-[140px] h-[140px] bg-[#e2e8f0] border-2 flex items-center justify-center cursor-pointer overflow-hidden group relative",
              showErrors && !formData.photo2x2 ? "border-red-500" : "border-transparent"
            ), children: [
              formData.photo2x2 ? /* @__PURE__ */ jsxDEV("img", { src: formData.photo2x2, alt: "2x2", className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1105,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV(ImageIcon, { className: "w-12 h-12 text-[#94a3b8]" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1107,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("input", { type: "file", className: "hidden", accept: "image/*", onChange: handlePhotoUpload }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1109,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1100,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[#1e3a8a] text-[11px] font-bold underline mt-2", children: "2 x 2 Picture" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1111,
              columnNumber: 17
            }, this),
            showErrors && !formData.photo2x2 && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 text-red-600 text-[10px] font-bold mt-1", children: [
              /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-3 h-3" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1114,
                columnNumber: 21
              }, this),
              " Attach image."
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1113,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1099,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Family Name" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1124,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "familyName", value: formData.familyName, onChange: handleChange, placeholder: "e.g. Dela Cruz", className: getErrorProps("familyName").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1125,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1123,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "First Name" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1128,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: "e.g. Juan", className: getErrorProps("firstName").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1129,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1127,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Middle Name" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1132,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "middleName", value: formData.middleName, onChange: handleChange, placeholder: "e.g. Santos", className: getErrorProps("middleName").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1133,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1131,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1122,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-5 relative", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Birthdate" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1140,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "date", name: "birthdate", value: formData.birthdate, onChange: handleChange, className: getErrorProps("birthdate").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1141,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1139,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-3", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Age" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1144,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "number", name: "age", value: formData.age, onChange: handleChange, placeholder: "e.g. 18", className: getErrorProps("age").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1145,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1143,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Sex" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1148,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 mt-2", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 text-xs font-bold text-[#0c2340] cursor-pointer", children: [
                    /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "sex", value: "Male", checked: formData.sex === "Male", onChange: () => handleRadioChange("sex", "Male") }, void 0, false, {
                      fileName: "/app/applet/src/pages/student/index.tsx",
                      lineNumber: 1151,
                      columnNumber: 25
                    }, this),
                    " Male"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1150,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 text-xs font-bold text-[#0c2340] cursor-pointer", children: [
                    /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "sex", value: "Female", checked: formData.sex === "Female", onChange: () => handleRadioChange("sex", "Female") }, void 0, false, {
                      fileName: "/app/applet/src/pages/student/index.tsx",
                      lineNumber: 1154,
                      columnNumber: 25
                    }, this),
                    " Female"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1153,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1149,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1147,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1138,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Year Level" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1163,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("select", { name: "yearLevel", value: formData.yearLevel, onChange: handleChange, className: getErrorProps("yearLevel").className, children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select Year Level..." }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1165,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "1st Year", children: "1st Year" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1166,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "2nd Year", children: "2nd Year" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1167,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "3rd Year", children: "3rd Year" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1168,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "4th Year", children: "4th Year" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1169,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1164,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1162,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Course" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1173,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "course", value: formData.course, onChange: handleChange, placeholder: "e.g. BSCS", className: getErrorProps("course").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1174,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1172,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Section" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1177,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "section", value: formData.section, onChange: handleChange, placeholder: "e.g. 2A", className: getErrorProps("section").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1178,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1176,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1161,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Contact No." }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1185,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "text", name: "contactNo", value: formData.contactNo, onChange: handleChange, placeholder: "e.g. 09123456789", className: getErrorProps("contactNo").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1186,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1184,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Gmail" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1189,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "e.g. juan@gmail.com", className: getErrorProps("email").className }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1190,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1188,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1183,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Permanent Address" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1196,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("input", { type: "text", name: "permanentAddress", value: formData.permanentAddress, onChange: handleChange, placeholder: "Complete permanent address", className: getErrorProps("permanentAddress").className }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1197,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1195,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("hr", { className: "my-6 border-gray-200" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1200,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-bold text-[#0c2340] uppercase", children: "Family Background" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1202,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-bold text-[#0c2340] mb-2 italic", children: "Father Information" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1206,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Name" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1209,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "fatherName", value: formData.fatherName, onChange: handleChange, className: getErrorProps("fatherName").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1210,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1208,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Occupation" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1213,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "fatherOccupation", value: formData.fatherOccupation, onChange: handleChange, className: getErrorProps("fatherOccupation").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1214,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1212,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Contact No." }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1217,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "fatherContact", value: formData.fatherContact, onChange: handleChange, className: getErrorProps("fatherContact").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1218,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1216,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1207,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1205,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-bold text-[#0c2340] mb-2 italic", children: "Mother Information" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1225,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Name" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1228,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "motherName", value: formData.motherName, onChange: handleChange, className: getErrorProps("motherName").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1229,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1227,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Occupation" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1232,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "motherOccupation", value: formData.motherOccupation, onChange: handleChange, className: getErrorProps("motherOccupation").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1233,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1231,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Contact No." }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1236,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "motherContact", value: formData.motherContact, onChange: handleChange, className: getErrorProps("motherContact").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1237,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1235,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1226,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1224,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-bold text-[#0c2340] mb-2 italic", children: "Guardian Information" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1244,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Name" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1247,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "guardianName", value: formData.guardianName, onChange: handleChange, className: getErrorProps("guardianName").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1248,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1246,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Occupation" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1251,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "guardianOccupation", value: formData.guardianOccupation, onChange: handleChange, className: getErrorProps("guardianOccupation").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1252,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1250,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-[11px] font-bold mb-1", children: "Contact No." }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1255,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "guardianContact", value: formData.guardianContact, onChange: handleChange, className: getErrorProps("guardianContact").className }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1256,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1254,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1245,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1243,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1120,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1097,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1092,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg border border-[#94a3b8] overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-[#dbeafe] px-4 py-2 flex items-center gap-3 border-b border-[#94a3b8]", children: /* @__PURE__ */ jsxDEV("h3", { className: "text-[#1e3a8a] font-bold text-xs uppercase", children: "C. Living Condition & Background" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1267,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1266,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "Highest Educational Attainment of your Parent/Guardian?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1271,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: ["Elementary Level", "Elementary Graduate", "High school Graduate", "College Graduate", "High School Level", "College Level", "post Graduate level/degree"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "highestEducationalAttainment", value: opt, checked: formData.highestEducationalAttainment === opt, onChange: () => handleRadioChange("highestEducationalAttainment", opt) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1275,
                columnNumber: 23
              }, this),
              " ",
              opt
            ] }, opt, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1274,
              columnNumber: 21
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1272,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1270,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "What is your family's approximate monthly income?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1282,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: ["below ₱ 10,000", "₱ 10,001 - ₱ 20,000", "₱ 20,001 - ₱ 30,000", "Above ₱ 30,000"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "monthlyIncome", value: opt, checked: formData.monthlyIncome === opt, onChange: () => handleRadioChange("monthlyIncome", opt) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1286,
                columnNumber: 23
              }, this),
              " ",
              opt
            ] }, opt, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1285,
              columnNumber: 21
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1283,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1281,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold", children: "Are you the first in the family to attend College?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1293,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 text-xs font-bold text-[#0c2340] cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "firstInFamilyToAttendCollege", value: "Yes", checked: formData.firstInFamilyToAttendCollege === "Yes", onChange: () => handleRadioChange("firstInFamilyToAttendCollege", "Yes") }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1295,
                columnNumber: 19
              }, this),
              " Yes"
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1294,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 text-xs font-bold text-[#0c2340] cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "firstInFamilyToAttendCollege", value: "No", checked: formData.firstInFamilyToAttendCollege === "No", onChange: () => handleRadioChange("firstInFamilyToAttendCollege", "No") }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1298,
                columnNumber: 19
              }, this),
              " No"
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1297,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1292,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-bold text-[#0c2340] uppercase mt-4 border-b pb-1", children: "C. Living Condition" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1302,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "With whom do you currently live?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1305,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: [
              ["Parents/Guardians", "Relatives", "Alone", "Boarding house"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "livingCondition", value: opt, checked: formData.livingCondition === opt, onChange: () => handleRadioChange("livingCondition", opt) }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1309,
                  columnNumber: 23
                }, this),
                " ",
                opt
              ] }, opt, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1308,
                columnNumber: 21
              }, this)),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer col-span-2", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "livingCondition", value: "others", checked: formData.livingCondition === "others", onChange: () => handleRadioChange("livingCondition", "others") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1313,
                  columnNumber: 21
                }, this),
                " others (please specify)",
                formData.livingCondition === "others" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "livingConditionOthers", value: formData.livingConditionOthers, onChange: handleChange, className: "ml-2 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 w-64" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1315,
                  columnNumber: 24
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1312,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1306,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1304,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "Type of Housing" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1322,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-2 text-xs", children: [
              ["Own house", "Rented house or apartment", "Boarding house"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "typeOfHousing", value: opt, checked: formData.typeOfHousing === opt, onChange: () => handleRadioChange("typeOfHousing", opt) }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1326,
                  columnNumber: 23
                }, this),
                " ",
                opt
              ] }, opt, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1325,
                columnNumber: 21
              }, this)),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "typeOfHousing", value: "others", checked: formData.typeOfHousing === "others", onChange: () => handleRadioChange("typeOfHousing", "others") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1330,
                  columnNumber: 21
                }, this),
                " others (please specify)",
                formData.typeOfHousing === "others" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "typeOfHousingOthers", value: formData.typeOfHousingOthers, onChange: handleChange, className: "ml-2 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 w-64" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1332,
                  columnNumber: 24
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1329,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1323,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1321,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1269,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1265,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg border border-[#94a3b8] overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-[#dbeafe] px-4 py-2 flex items-center gap-3 border-b border-[#94a3b8]", children: /* @__PURE__ */ jsxDEV("h3", { className: "text-[#1e3a8a] font-bold text-xs uppercase", children: "D. Access to Resources & E. Student Classification" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1343,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1342,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "D. Access to Resources - Do you have access of the following at home?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1347,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: ["Personal Computer/Laptop", "Internet Connection", "Study space", "Textbooks and learning materials"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: formData.accessToResources.includes(opt), onChange: () => handleCheckboxChange("accessToResources", opt) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1351,
                columnNumber: 23
              }, this),
              " ",
              opt
            ] }, opt, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1350,
              columnNumber: 21
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1348,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1346,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold", children: "Do you work while studying?" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1358,
              columnNumber: 17
            }, this),
            ["Yes, full-time", "Yes, part-time", "No"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 text-xs font-bold text-[#0c2340] cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "workingStudent", value: opt, checked: formData.workingStudent === opt, onChange: () => handleRadioChange("workingStudent", opt) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1361,
                columnNumber: 21
              }, this),
              " ",
              opt
            ] }, opt, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1360,
              columnNumber: 19
            }, this))
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1357,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-2", children: "E. Student Classification - Which of the following classification best describe your current status? (Multiple responses)" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1367,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: [
              [
                "Indigenous Peoples (IPs)",
                "Solo Parent",
                "Child of a solo parent",
                "Persons with disabilities (PWDs)",
                "Child of Person with Disabilities (PWD)",
                "Drop out or learner who returned to school",
                "Child of drop out or learner who returned to school",
                "Rebel returnees",
                "Child of a rebel returnees",
                "Dependent or child of OFW",
                "Member of 4Ps",
                "Member of Calamity or Disaster Affected Family",
                "Orphan/Child in need of special protection",
                "Working Student",
                "From geographically isolated & disadvantaged area (GIDA)",
                "Muslim Student",
                "Low income family/ Economically disadvantaged student",
                "Senior Citizen student",
                "First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)",
                "LGBTQ+ Community",
                "Regular student (I do not belong to any of this group classification)"
              ].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: formData.studentClassification.includes(opt), onChange: () => handleCheckboxChange("studentClassification", opt) }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1378,
                  columnNumber: 23
                }, this),
                " ",
                opt
              ] }, opt, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1377,
                columnNumber: 21
              }, this)),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer col-span-2 mt-1", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: formData.studentClassification.includes("others"), onChange: () => handleCheckboxChange("studentClassification", "others") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1382,
                  columnNumber: 21
                }, this),
                " others (Please specify)",
                formData.studentClassification.includes("others") && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "studentClassificationOthers", value: formData.studentClassificationOthers, onChange: handleChange, className: "ml-2 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 w-64" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1384,
                  columnNumber: 24
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1381,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1368,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1366,
            columnNumber: 15
          }, this),
          formData.studentClassification.includes("Working Student") || formData.workingStudent.startsWith("Yes") ? /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-1", children: "If you are working student, please indicate your type of work or source of income" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1392,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "text", name: "typeOfWorkOrSourceOfIncome", value: formData.typeOfWorkOrSourceOfIncome, onChange: handleChange, className: "w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 py-1" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1393,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1391,
            columnNumber: 17
          }, this) : null,
          formData.studentClassification.includes("Persons with disabilities (PWDs)") ? /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-1", children: "If you are a student with special needs/Person with disability (PWD), please specify your condition or disability" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1399,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "text", name: "specialNeedsOrDisability", value: formData.specialNeedsOrDisability, onChange: handleChange, className: "w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 py-1" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1400,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1398,
            columnNumber: 17
          }, this) : null,
          formData.studentClassification.includes("Drop out or learner who returned to school") ? /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[#0c2340] text-xs font-bold mb-1", children: "If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted." }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1406,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "text", name: "pdlReason", value: formData.pdlReason, onChange: handleChange, className: "w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs px-1 py-1" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1407,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1405,
            columnNumber: 17
          }, this) : null
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1345,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1341,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg border border-[#94a3b8] overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-[#dbeafe] px-4 py-2 flex items-center gap-3 border-b border-[#94a3b8]", children: /* @__PURE__ */ jsxDEV("h3", { className: "text-[#1e3a8a] font-bold text-xs uppercase", children: "SCHOLARSHIP CATEGORY" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1416,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1415,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 border-b border-gray-200 pb-4", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 text-sm font-bold cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategoryType", value: "A", checked: formData.scholarshipCategoryType === "A", onChange: () => handleRadioChange("scholarshipCategoryType", "A") }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1421,
                columnNumber: 19
              }, this),
              " A. Internally-Funded"
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1420,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2 text-sm font-bold cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategoryType", value: "B", checked: formData.scholarshipCategoryType === "B", onChange: () => handleRadioChange("scholarshipCategoryType", "B") }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1424,
                columnNumber: 19
              }, this),
              " B. Externally-Funded"
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1423,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1419,
            columnNumber: 15
          }, this),
          formData.scholarshipCategoryType === "A" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs", children: "Entrance" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1430,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 text-xs", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Valedictorian", checked: formData.scholarshipCategory === "Valedictorian", onChange: () => handleRadioChange("scholarshipCategory", "Valedictorian") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1432,
                  columnNumber: 66
                }, this),
                " Valedictorian"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1432,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Salutatorian", checked: formData.scholarshipCategory === "Salutatorian", onChange: () => handleRadioChange("scholarshipCategory", "Salutatorian") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1433,
                  columnNumber: 66
                }, this),
                " Salutatorian"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1433,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1431,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs pt-2", children: "Academic" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1436,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 text-xs", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Academic Full", checked: formData.scholarshipCategory === "Academic Full", onChange: () => handleRadioChange("scholarshipCategory", "Academic Full") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1438,
                  columnNumber: 66
                }, this),
                " Full"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1438,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Academic Partial", checked: formData.scholarshipCategory === "Academic Partial", onChange: () => handleRadioChange("scholarshipCategory", "Academic Partial") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1439,
                  columnNumber: 66
                }, this),
                " Partial"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1439,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Academic Regional", checked: formData.scholarshipCategory === "Academic Regional", onChange: () => handleRadioChange("scholarshipCategory", "Academic Regional") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1440,
                  columnNumber: 66
                }, this),
                " Regional"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1440,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Academic National", checked: formData.scholarshipCategory === "Academic National", onChange: () => handleRadioChange("scholarshipCategory", "Academic National") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1441,
                  columnNumber: 66
                }, this),
                " National"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1441,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1437,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs pt-2", children: "Socio-cultural" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1444,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 text-xs", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Socio Regional", checked: formData.scholarshipCategory === "Socio Regional", onChange: () => handleRadioChange("scholarshipCategory", "Socio Regional") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1446,
                  columnNumber: 66
                }, this),
                " Regional"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1446,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Socio National", checked: formData.scholarshipCategory === "Socio National", onChange: () => handleRadioChange("scholarshipCategory", "Socio National") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1447,
                  columnNumber: 66
                }, this),
                " National"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1447,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1445,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs pt-2", children: "Institutional" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1450,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Dependent of Faculty or Staff", checked: formData.scholarshipCategory === "Dependent of Faculty or Staff", onChange: () => handleRadioChange("scholarshipCategory", "Dependent of Faculty or Staff") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1452,
                  columnNumber: 66
                }, this),
                " Dependent of Faculty or Staff"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1452,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "President - SSC", checked: formData.scholarshipCategory === "President - SSC", onChange: () => handleRadioChange("scholarshipCategory", "President - SSC") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1453,
                  columnNumber: 66
                }, this),
                " President - SSC"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1453,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "President - FLP", checked: formData.scholarshipCategory === "President - FLP", onChange: () => handleRadioChange("scholarshipCategory", "President - FLP") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1454,
                  columnNumber: 66
                }, this),
                " President - FLP"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1454,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Editor-in-Chief (Campus Publication)", checked: formData.scholarshipCategory === "Editor-in-Chief (Campus Publication)", onChange: () => handleRadioChange("scholarshipCategory", "Editor-in-Chief (Campus Publication)") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1455,
                  columnNumber: 66
                }, this),
                " Editor-in-Chief (Campus Publication)"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1455,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "CapSU Band / Chorale", checked: formData.scholarshipCategory === "CapSU Band / Chorale", onChange: () => handleRadioChange("scholarshipCategory", "CapSU Band / Chorale") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1456,
                  columnNumber: 66
                }, this),
                " CapSU Band / Chorale"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1456,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1451,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "pt-2 text-xs flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Others Internally-Funded", checked: formData.scholarshipCategory === "Others Internally-Funded", onChange: () => handleRadioChange("scholarshipCategory", "Others Internally-Funded") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1460,
                  columnNumber: 66
                }, this),
                " Others (specify)"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1460,
                columnNumber: 21
              }, this),
              formData.scholarshipCategory === "Others Internally-Funded" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "scholarshipCategoryOthers", value: formData.scholarshipCategoryOthers, onChange: handleChange, className: "border-b border-gray-400 focus:outline-none focus:border-blue-500 w-64 px-1" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1462,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1459,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1429,
            columnNumber: 17
          }, this),
          formData.scholarshipCategoryType === "B" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs mb-2", children: "CHED" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1471,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: [
                ["ANAC - IP", "Pag - ulikid", "Barangay (Legal dependents of Brgy. Officials)", "ESGP - PA", "UniFast", "Tertiary Education Subsidy (TES)"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: opt, checked: formData.scholarshipCategory === opt, onChange: () => handleRadioChange("scholarshipCategory", opt) }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1474,
                    columnNumber: 80
                  }, this),
                  " ",
                  opt
                ] }, opt, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1474,
                  columnNumber: 25
                }, this)),
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Congressional District", checked: formData.scholarshipCategory === "Congressional District", onChange: () => handleRadioChange("scholarshipCategory", "Congressional District") }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1477,
                    columnNumber: 68
                  }, this),
                  " Congressional District (specify)",
                  formData.scholarshipCategory === "Congressional District" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "congressionalDistrict", value: formData.congressionalDistrict, onChange: handleChange, className: "ml-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 w-32 px-1" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1478,
                    columnNumber: 87
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1477,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "One Town One Scholar", checked: formData.scholarshipCategory === "One Town One Scholar", onChange: () => handleRadioChange("scholarshipCategory", "One Town One Scholar") }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1481,
                    columnNumber: 68
                  }, this),
                  " One Town One Scholar (specify)",
                  formData.scholarshipCategory === "One Town One Scholar" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "oneTownOneScholar", value: formData.oneTownOneScholar, onChange: handleChange, className: "ml-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 w-32 px-1" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1482,
                    columnNumber: 85
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1481,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Tulong Dunong", checked: formData.scholarshipCategory === "Tulong Dunong", onChange: () => handleRadioChange("scholarshipCategory", "Tulong Dunong") }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1485,
                    columnNumber: 68
                  }, this),
                  " Tulong Dunong (specify)",
                  formData.scholarshipCategory === "Tulong Dunong" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "tulongDunong", value: formData.tulongDunong, onChange: handleChange, className: "ml-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 w-32 px-1" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1486,
                    columnNumber: 78
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1485,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "Others Externally-Funded", checked: formData.scholarshipCategory === "Others Externally-Funded", onChange: () => handleRadioChange("scholarshipCategory", "Others Externally-Funded") }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1489,
                    columnNumber: 68
                  }, this),
                  " Others (specify)",
                  formData.scholarshipCategory === "Others Externally-Funded" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "externallyFundedOthers", value: formData.externallyFundedOthers, onChange: handleChange, className: "ml-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 w-32 px-1" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1490,
                    columnNumber: 89
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1489,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1472,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1470,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-xs mb-2", children: "Merit" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1496,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-xs", children: ["VIC", "Capizeño Circle", "DOST", "GRF"].map((opt) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: opt, checked: formData.scholarshipCategory === opt, onChange: () => handleRadioChange("scholarshipCategory", opt) }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1499,
                  columnNumber: 80
                }, this),
                " ",
                opt
              ] }, opt, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1499,
                columnNumber: 25
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1497,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1495,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "LGU", checked: formData.scholarshipCategory === "LGU", onChange: () => handleRadioChange("scholarshipCategory", "LGU") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1505,
                  columnNumber: 66
                }, this),
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "LGU:" }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1505,
                  columnNumber: 242
                }, this),
                " Barangay, Municipality, Province (Landline) Contact person or issuing office:"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1505,
                columnNumber: 21
              }, this),
              formData.scholarshipCategory === "LGU" && /* @__PURE__ */ jsxDEV("input", { type: "text", name: "lguContactPerson", value: formData.lguContactPerson, onChange: handleChange, className: "w-full mt-2 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-1" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1507,
                columnNumber: 24
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1504,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs border p-4 rounded-lg bg-gray-50 border-gray-200", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 font-bold mb-4", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "scholarshipCategory", value: "DSWD", checked: formData.scholarshipCategory === "DSWD", onChange: () => handleRadioChange("scholarshipCategory", "DSWD") }, void 0, false, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1512,
                  columnNumber: 81
                }, this),
                " DSWD:"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1512,
                columnNumber: 21
              }, this),
              formData.scholarshipCategory === "DSWD" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pl-6", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-32", children: "Municipality:" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1517,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "dswdMunicipality", value: formData.dswdMunicipality, onChange: handleChange, className: "flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-1 bg-transparent" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1518,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1516,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-32", children: "Contact person:" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1521,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "dswdContactPerson", value: formData.dswdContactPerson, onChange: handleChange, className: "flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-1 bg-transparent" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1522,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1520,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-32", children: "Designation:" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1525,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "dswdDesignation", value: formData.dswdDesignation, onChange: handleChange, className: "flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-1 bg-transparent" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1526,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1524,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-32", children: "Others (specify):" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1529,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("input", { type: "text", name: "dswdOthers", value: formData.dswdOthers, onChange: handleChange, className: "flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-1 bg-transparent" }, void 0, false, {
                    fileName: "/app/applet/src/pages/student/index.tsx",
                    lineNumber: 1530,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/student/index.tsx",
                  lineNumber: 1528,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1515,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1511,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1469,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1418,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1414,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mt-8", children: [
        /* @__PURE__ */ jsxDEV("button", { onClick: () => navigate("/student/login"), className: "bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors", children: "Cancel" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1542,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: handleNext, className: "bg-[#1e3a8a] text-white px-8 py-3 rounded-md font-bold hover:bg-[#1e40af] transition-colors shadow-sm", children: "Next Step" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1545,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1541,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 1070,
      columnNumber: 9
    }, this),
    step === 2 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden border-t-[8px] border-t-[#d97706] border border-gray-200 text-center pb-6", children: /* @__PURE__ */ jsxDEV("div", { className: "pt-8 pb-4", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-[28px] font-bold font-serif text-[#000000]", children: "Scholarship Documents" }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1556,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 text-sm font-serif mt-2 px-10", children: [
          "Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as",
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1558,
            columnNumber: 140
          }, this),
          "Data Privacy Act of 2012"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1557,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1555,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1554,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-[#fef3c7] border border-[#fcd34d] rounded-md px-6 py-3 text-left", children: /* @__PURE__ */ jsxDEV("p", { className: "text-[#d97706] text-xs font-semibold", children: "Upload the following required scholarship documents." }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1564,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1563,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm pt-14 pb-14 px-8", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-10 max-w-[700px] mx-auto", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between w-full gap-8", children: [
          renderCard("Valid Student ID", "Student ID", ""),
          renderCard("Registration Form (RF)", "RF", "Registration Form")
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1571,
          columnNumber: 16
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center w-full", children: renderCard("General Weighted Average (GWA)", "GWA", "General Weighted Average") }, void 0, false, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1575,
          columnNumber: 16
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1570,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1569,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between mt-10 px-8", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handlePrev,
            className: "bg-[#30416b] text-white w-32 py-3.5 rounded-xl font-bold hover:bg-[#1e2f5c] transition-colors shadow-md text-sm",
            children: "Back"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1583,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleNext,
            className: "bg-[#30416b] text-white w-32 py-3.5 rounded-xl font-bold hover:bg-[#1e2f5c] transition-colors shadow-md text-sm",
            children: "Next"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1589,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1582,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 1552,
      columnNumber: 9
    }, this),
    step === 3 && /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-8 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-4", children: "Review & Submit" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1601,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-6", children: "Review your information before submitting." }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1602,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 mb-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 uppercase tracking-wider font-bold", children: "Applicant Name" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1607,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-medium", children: [
              formData.firstName,
              " ",
              formData.middleName,
              " ",
              formData.familyName
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1608,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1606,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 uppercase tracking-wider font-bold", children: "Course & Year" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1611,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-medium", children: [
              formData.course,
              " - ",
              formData.yearLevel
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1612,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1610,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 uppercase tracking-wider font-bold", children: "Contact" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1615,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-medium", children: formData.contactNo }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1616,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1614,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 uppercase tracking-wider font-bold", children: "Email" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1619,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[#0c2340] font-medium", children: formData.email }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1620,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1618,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1605,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-6 border-t border-gray-200 pt-4", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 uppercase tracking-wider font-bold mb-2", children: "Uploaded Files" }, void 0, false, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1625,
            columnNumber: 16
          }, this),
          /* @__PURE__ */ jsxDEV("ul", { className: "space-y-2", children: [
            files.map((f) => /* @__PURE__ */ jsxDEV("li", { className: "flex items-center gap-2 text-sm text-[#0c2340]", children: [
              /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-4 h-4 text-[#16a34a]" }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1629,
                columnNumber: 22
              }, this),
              " ",
              f.category,
              ": ",
              /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: f.name }, void 0, false, {
                fileName: "/app/applet/src/pages/student/index.tsx",
                lineNumber: 1629,
                columnNumber: 88
              }, this)
            ] }, f.id, true, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1628,
              columnNumber: 20
            }, this)),
            files.length === 0 && /* @__PURE__ */ jsxDEV("li", { className: "text-sm text-gray-400 italic", children: "No files uploaded" }, void 0, false, {
              fileName: "/app/applet/src/pages/student/index.tsx",
              lineNumber: 1632,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1626,
            columnNumber: 16
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/student/index.tsx",
          lineNumber: 1624,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1604,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between mt-8", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handlePrev,
            className: "border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors",
            children: "Back"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1637,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: async () => {
              setIsSubmitting(true);
              const submissionId = `sub-${Date.now()}`;
              const newSubmission = {
                id: submissionId,
                studentId: user?.studentId || "2024-CAPSU-001",
                studentName: `${formData.firstName} ${formData.middleName ? formData.middleName + " " : ""}${formData.familyName}`.trim(),
                scholarshipType: selectedScholarship?.name || "Academic Scholarship",
                status: "Pending",
                submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
                data: formData,
                files
              };
              try {
                await db.submissions.create(newSubmission);
                setIsSubmitting(false);
                setShowToast(true);
                setTimeout(() => {
                  setShowToast(false);
                  navigate("/student/dashboard");
                }, 4e3);
              } catch (e) {
                console.error(e);
                setIsSubmitting(false);
              }
            },
            disabled: isSubmitting,
            className: "bg-[#16a34a] text-white px-8 py-3 rounded-md font-bold hover:bg-[#15803d] transition-colors",
            children: isSubmitting ? "Submitting..." : "Submit Application"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/student/index.tsx",
            lineNumber: 1643,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1636,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 1600,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: cn(
      "fixed bottom-6 left-6 flex items-center gap-3 bg-white border border-[#22c55e] text-[#166534] px-4 py-3 rounded-lg shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all duration-300 z-50",
      showToast ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
    ), children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-[#22c55e] text-white rounded-full p-1", children: /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1685,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1684,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-sm", children: "Successfully submitted!" }, void 0, false, {
        fileName: "/app/applet/src/pages/student/index.tsx",
        lineNumber: 1687,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/student/index.tsx",
      lineNumber: 1680,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/student/index.tsx",
    lineNumber: 1017,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgT3V0bGV0LCBMaW5rLCB1c2VOYXZpZ2F0ZSwgdXNlU2VhcmNoUGFyYW1zIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBjbiB9IGZyb20gJy4uLy4uL2xpYi91dGlscyc7XG5pbXBvcnQgeyBVc2VyLFxuICBMb2dPdXQsIFVwbG9hZCwgQ2hlY2tDaXJjbGUyLCBDaGV2cm9uRG93biwgQ2hldnJvblVwLCBWaWV3LCBGaWxlVGV4dCwgQXdhcmQsIEdyYWR1YXRpb25DYXAsXG4gIFBlblRvb2wsIFRyYXNoMiwgQ2FtZXJhLCBDcmVkaXRDYXJkLCBGaWxlQ2hlY2ssIEV5ZSwgUmVmcmVzaEN3LCBDaGVjaywgQWxlcnRDaXJjbGUsXG4gIFNwYXJrbGVzLCBJbWFnZSBhcyBJbWFnZUljb24sIFgsIERvd25sb2FkLCBTaGllbGRDaGVjaywgQ2FsZW5kYXIsIEFsZXJ0VHJpYW5nbGUsIEVkaXRcbn0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IGRiIH0gZnJvbSAnLi4vLi4vbGliL2RiJztcbmltcG9ydCB7IG1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5cbmltcG9ydCB7IHNpZ25JbldpdGhHb29nbGUsIGxvZ091dCB9IGZyb20gJy4uLy4uL2xpYi9maXJlYmFzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHVkZW50TG9naW4oKSB7XG4gIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcbiAgY29uc3QgW2lzTG9naW4sIHNldElzTG9naW5dID0gdXNlU3RhdGUodHJ1ZSk7XG4gIFxuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtmaXJzdE5hbWUsIHNldEZpcnN0TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtsYXN0TmFtZSwgc2V0TGFzdE5hbWVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBoYW5kbGVHb29nbGVMb2dpbiA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZmJVc2VyID0gYXdhaXQgc2lnbkluV2l0aEdvb2dsZSgpO1xuICAgICAgXG4gICAgICBsZXQgdXNlciA9IGF3YWl0IGRiLnVzZXJzLmZpbmRCeUVtYWlsKGZiVXNlci5lbWFpbCB8fCAnJyk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICBpZDogZmJVc2VyLnVpZCxcbiAgICAgICAgICBlbWFpbDogZmJVc2VyLmVtYWlsIHx8ICcnLFxuICAgICAgICAgIGZpcnN0TmFtZTogZmJVc2VyLmRpc3BsYXlOYW1lPy5zcGxpdCgnICcpWzBdIHx8ICdVc2VyJyxcbiAgICAgICAgICBsYXN0TmFtZTogZmJVc2VyLmRpc3BsYXlOYW1lPy5zcGxpdCgnICcpLnNsaWNlKDEpLmpvaW4oJyAnKSB8fCAnJyxcbiAgICAgICAgICByb2xlOiAnc3R1ZGVudCcgYXMgY29uc3RcbiAgICAgICAgfTtcbiAgICAgICAgYXdhaXQgZGIudXNlcnMuc2V0KHVzZXIuaWQsIHVzZXIpO1xuICAgICAgfVxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnc3R1ZGVudEF1dGgnLCAndHJ1ZScpO1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnc3R1ZGVudFVzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyKSk7XG4gICAgICBuYXZpZ2F0ZSgnL3N0dWRlbnQvZGFzaGJvYXJkJyk7XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgIGlmIChlcnI/LmNvZGUgPT09ICdhdXRoL3BvcHVwLWNsb3NlZC1ieS11c2VyJyB8fCBlcnI/LmNvZGUgPT09ICdhdXRoL2NhbmNlbGxlZC1wb3B1cC1yZXF1ZXN0Jykge1xuICAgICAgICBzZXRFcnJvcignU2lnbi1pbiBjYW5jZWxsZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgICB9IGVsc2UgaWYgKGVycj8uY29kZSA9PT0gJ2F1dGgvcG9wdXAtYmxvY2tlZCcpIHtcbiAgICAgICAgc2V0RXJyb3IoJ1NpZ24taW4gcG9wdXAgd2FzIGJsb2NrZWQgYnkgeW91ciBicm93c2VyLiBQbGVhc2UgYWxsb3cgcG9wdXBzIGZvciB0aGlzIHNpdGUuJyk7XG4gICAgICB9IGVsc2UgaWYgKGVycj8uY29kZSA9PT0gJ2F1dGgvdW5hdXRob3JpemVkLWRvbWFpbicpIHtcbiAgICAgICAgc2V0RXJyb3IoJ0RvbWFpbiBub3QgYXV0aG9yaXplZCBpbiBGaXJlYmFzZS4gQWRkIHRoaXMgVVJMIHRvIEZpcmViYXNlIEF1dGggc2V0dGluZ3MuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiU3R1ZGVudCBsb2dpbiBlcnJvclwiLCBlcnIpO1xuICAgICAgICBzZXRFcnJvcignRmFpbGVkIHRvIHNpZ24gaW4uIElmIHByZXZpZXdpbmcsIHRyeSBvcGVuaW5nIGluIGEgbmV3IHRhYi4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGU6IFJlYWN0LkZvcm1FdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzZXRFcnJvcignJyk7XG4gICAgXG4gICAgaWYgKGlzTG9naW4pIHtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBkYi51c2Vycy5maW5kQnlFbWFpbChlbWFpbCk7XG4gICAgICBpZiAodXNlciAmJiB1c2VyLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdzdHVkZW50QXV0aCcsICd0cnVlJyk7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3N0dWRlbnRVc2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xuICAgICAgICBuYXZpZ2F0ZSgnL3N0dWRlbnQvZGFzaGJvYXJkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRFcnJvcignSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGRiLnVzZXJzLmZpbmRCeUVtYWlsKGVtYWlsKTtcbiAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICBzZXRFcnJvcignRW1haWwgYWxyZWFkeSBleGlzdHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgICAgaWQ6IERhdGUubm93KCkudG9TdHJpbmcoKSxcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBmaXJzdE5hbWUsXG4gICAgICAgIGxhc3ROYW1lLFxuICAgICAgICByb2xlOiAnc3R1ZGVudCcgYXMgY29uc3RcbiAgICAgIH07XG4gICAgICBhd2FpdCBkYi51c2Vycy5zZXQobmV3VXNlci5pZCwgbmV3VXNlcik7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdzdHVkZW50QXV0aCcsICd0cnVlJyk7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdzdHVkZW50VXNlcicsIEpTT04uc3RyaW5naWZ5KG5ld1VzZXIpKTtcbiAgICAgIG5hdmlnYXRlKCcvc3R1ZGVudC9kYXNoYm9hcmQnKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1bdXJsKCcvQkkucG5nJyldIGJnLWNvdmVyIGJnLWNlbnRlciBwLTRcIj5cbiAgICAgIDxtb3Rpb24uZGl2IFxuICAgICAgICBpbml0aWFsPXt7IHk6IDUwLCBvcGFjaXR5OiAwIH19XG4gICAgICAgIGFuaW1hdGU9e3sgeTogMCwgb3BhY2l0eTogMSB9fVxuICAgICAgICB0cmFuc2l0aW9uPXt7IHR5cGU6IFwic3ByaW5nXCIsIHN0aWZmbmVzczogMTAwLCBkYW1waW5nOiAyMCB9fVxuICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBiZy1bI2E1ZDhmZl0gcC04IHJvdW5kZWQtWzMycHhdIHNoYWRvdy0yeGwgdy1mdWxsIG1heC13LVszODBweF0gdGV4dC1jZW50ZXJcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14LWF1dG8gaC0xNiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi0zXCI+XG4gICAgICAgICAgPGltZyBzcmM9XCIvY2Fwc3UtbG9nby5wbmdcIiBhbHQ9XCJMb2dvXCIgY2xhc3NOYW1lPVwiaC1mdWxsIG9iamVjdC1jb250YWluXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCB0ZXh0LVsjMGYyZTYwXSBtYi0zIGxlYWRpbmctc251Z1wiPldlYi1CYXNlZCBTY2hvbGFyc2hpcCBTdWJtaXNzaW9uPGJyLz5BbGVydCBTeXN0ZW08L2gxPlxuICAgICAgICBcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgYmctWyM1ZGFlZjVdIHRleHQtd2hpdGUgcHgtNSBweS0xIHJvdW5kZWQtZnVsbCB0ZXh0LVsxMXB4XSBmb250LXNlbWlib2xkIG1iLTYgc2hhZG93LXNtIHRyYWNraW5nLXdpZGVcIj5cbiAgICAgICAgICBTdHVkZW50IFBvcnRhbFxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggYmctd2hpdGUvNDAgYmFja2Ryb3AtYmx1ci1zbSByb3VuZGVkLWZ1bGwgcC0xIG1iLTUgc2hhZG93LXNtIGJvcmRlciBib3JkZXItd2hpdGUvNDBcIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFwiZmxleC0xIHB5LTEuNSB0ZXh0LVsxMnB4XSBmb250LWJvbGQgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tYWxsXCIsICFpc0xvZ2luID8gXCJiZy1bIzM5ODRiZV0gdGV4dC13aGl0ZSBzaGFkb3ctbWRcIiA6IFwidGV4dC1bIzBmMmU2MF0gaG92ZXI6Ymctd2hpdGUvNTBcIil9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0xvZ2luKGZhbHNlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBSZWdpc3RlclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXCJmbGV4LTEgcHktMS41IHRleHQtWzEycHhdIGZvbnQtYm9sZCByb3VuZGVkLWZ1bGwgdHJhbnNpdGlvbi1hbGxcIiwgaXNMb2dpbiA/IFwiYmctWyMzOTg0YmVdIHRleHQtd2hpdGUgc2hhZG93LW1kXCIgOiBcInRleHQtWyMwZjJlNjBdIGhvdmVyOmJnLXdoaXRlLzUwXCIpfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRJc0xvZ2luKHRydWUpOyBzZXRFcnJvcignJyk7IH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgTG9nIEluXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAge2Vycm9yICYmIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwIHRleHQteHMgdGV4dC1jZW50ZXIgbWItMlwiPntlcnJvcn08L2Rpdj59XG5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlR29vZ2xlTG9naW59XG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXdoaXRlIHRleHQtZ3JheS03MDAgcHktMi41IHJvdW5kZWQtZnVsbCBmb250LW1lZGl1bSBob3ZlcjpiZy1ncmF5LTUwIHRyYW5zaXRpb24tY29sb3JzIHNoYWRvdy1zbSB0ZXh0LXNtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIGJvcmRlciBib3JkZXItd2hpdGUvNjAgbWItNFwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cInctNCBoLTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZmlsbD1cIiM0Mjg1RjRcIiBkPVwiTTIyLjU2IDEyLjI1YzAtLjc4LS4wNy0xLjUzLS4yLTIuMjVIMTJ2NC4yNmg1LjkyYy0uMjYgMS4zNy0xLjA0IDIuNTMtMi4yMSAzLjMxdjIuNzdoMy41N2MyLjA4LTEuOTIgMy4yOC00Ljc0IDMuMjgtOC4wOXpcIi8+PHBhdGggZmlsbD1cIiMzNEE4NTNcIiBkPVwiTTEyIDIzYzIuOTcgMCA1LjQ2LS45OCA3LjI4LTIuNjZsLTMuNTctMi43N2MtLjk4LjY2LTIuMjMgMS4wNi0zLjcxIDEuMDYtMi44NiAwLTUuMjktMS45My02LjE2LTQuNTNIMi4xOHYyLjg0QzMuOTkgMjAuNTMgNy43IDIzIDEyIDIzelwiLz48cGF0aCBmaWxsPVwiI0ZCQkMwNVwiIGQ9XCJNNS44NCAxNC4wOWMtLjIyLS42Ni0uMzUtMS4zNi0uMzUtMi4wOXMuMTMtMS40My4zNS0yLjA5VjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEycy40MyAzLjQ1IDEuMTggNC45M2wyLjg1LTIuMjIuODEtLjYyelwiLz48cGF0aCBmaWxsPVwiI0VBNDMzNVwiIGQ9XCJNMTIgNS4zOGMxLjYyIDAgMy4wNi41NiA0LjIxIDEuNjRsMy4xNS0zLjE1QzE3LjQ1IDIuMDkgMTQuOTcgMSAxMiAxIDcuNyAxIDMuOTkgMy40NyAyLjE4IDcuMDdsMy42NiAyLjg0Yy44Ny0yLjYgMy4zLTQuNTMgNi4xNi00LjUzelwiLz48L3N2Zz5cbiAgICAgICAgICBDb250aW51ZSB3aXRoIEdvb2dsZVxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIG1iLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtcHggYmctWyMwZjJlNjBdLzEwIGZsZXgtMVwiPjwvZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtWyMwZjJlNjBdLzQwIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5Pcjwvc3Bhbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtcHggYmctWyMwZjJlNjBdLzEwIGZsZXgtMVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInNwYWNlLXktM1wiIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxuICAgICAgICAgIHshaXNMb2dpbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgZmxleC0xXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRleHQtWyMwZjJlNjBdIG1iLTEgbWwtMVwiPkZpcnN0IE5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPXtmaXJzdE5hbWV9IG9uQ2hhbmdlPXtlID0+IHNldEZpcnN0TmFtZShlLnRhcmdldC52YWx1ZSl9IHJlcXVpcmVkPXshaXNMb2dpbn0gY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMiBiZy13aGl0ZSByb3VuZGVkIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDAvNTAgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIG91dGxpbmUtbm9uZSB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctc21cIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgZmxleC0xXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRleHQtWyMwZjJlNjBdIG1iLTEgbWwtMVwiPkxhc3QgTmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2xhc3ROYW1lfSBvbkNoYW5nZT17ZSA9PiBzZXRMYXN0TmFtZShlLnRhcmdldC52YWx1ZSl9IHJlcXVpcmVkPXshaXNMb2dpbn0gY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMiBiZy13aGl0ZSByb3VuZGVkIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDAvNTAgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIG91dGxpbmUtbm9uZSB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctc21cIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGVmdFwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRleHQtWyMwZjJlNjBdIG1iLTEgbWwtMVwiPkVtYWlsPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiB2YWx1ZT17ZW1haWx9IG9uQ2hhbmdlPXtlID0+IHNldEVtYWlsKGUudGFyZ2V0LnZhbHVlKX0gcmVxdWlyZWQgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IGJnLXdoaXRlIHJvdW5kZWQgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMC81MCBmb2N1czpib3JkZXItYmx1ZS01MDAgb3V0bGluZS1ub25lIHRyYW5zaXRpb24tYWxsIHNoYWRvdy1zbVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGVmdCByZWxhdGl2ZVwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRleHQtWyMwZjJlNjBdIG1iLTEgbWwtMVwiPlBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPXtwYXNzd29yZH0gb25DaGFuZ2U9e2UgPT4gc2V0UGFzc3dvcmQoZS50YXJnZXQudmFsdWUpfSByZXF1aXJlZCBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgYmctd2hpdGUgcm91bmRlZCB0ZXh0LXNtIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLWJsdWUtNTAwLzUwIGZvY3VzOmJvcmRlci1ibHVlLTUwMCBvdXRsaW5lLW5vbmUgdHJhbnNpdGlvbi1hbGwgc2hhZG93LXNtXCIgLz5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtNCB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1ncmF5LTQwMCBob3Zlcjp0ZXh0LWdyYXktNjAwXCI+XG4gICAgICAgICAgICAgICAgPFZpZXcgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7aXNMb2dpbiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0IG10LTFcIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtWyMwZjJlNjBdLzcwIGhvdmVyOnRleHQtWyMwZjJlNjBdIGhvdmVyOnVuZGVybGluZSBweC0xXCI+Rm9yZ290IFBhc3N3b3JkPzwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LVsjMGYyZTYwXS81MCBtdC0xIHB4LTFcIj5BdCBsZWFzdCA4IGNoYXJhY3RlcnM8L3A+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtMlwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwidy1mdWxsIGJnLVsjMTg2NGRiXSB0ZXh0LXdoaXRlIHB5LTIuNSByb3VuZGVkLWZ1bGwgZm9udC1tZWRpdW0gaG92ZXI6YmctWyMxMjRiOWZdIHRyYW5zaXRpb24tY29sb3JzIHNoYWRvdy1tZCBzaGFkb3ctYmx1ZS05MDAvMjAgdGV4dC1zbVwiPlxuICAgICAgICAgICAgICB7aXNMb2dpbiA/ICdMb2cgSW4nIDogJ0NyZWF0ZSBBY2NvdW50J31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L21vdGlvbi5kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHVkZW50TGF5b3V0KCkge1xuICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPHtlbWFpbD86IHN0cmluZ30gfCBudWxsPihudWxsKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNlc3Npb25TdHIgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdzdHVkZW50VXNlcicpO1xuICAgIGlmIChzZXNzaW9uU3RyKSB7XG4gICAgICBzZXRVc2VyKEpTT04ucGFyc2Uoc2Vzc2lvblN0cikpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctWyNmNGY3ZmJdIGZvbnQtc2Fuc1wiPlxuICAgICAgey8qIFRvcCBOYXZiYXIgKi99XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImJnLVsjMmI2NGIxXSB0ZXh0LXdoaXRlIHB5LTMgcHgtOCBzaGFkb3ctc20gZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHN0aWNreSB0b3AtMCB6LTUwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiBiZy13aGl0ZSByb3VuZGVkLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIi9jYXBzdS1sb2dvLnBuZ1wiIGFsdD1cIkNBUFNVIExvZ29cIiBjbGFzc05hbWU9XCJ3LTEwIGgtMTAgb2JqZWN0LWNvbnRhaW5cIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1bMTdweF0gZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0XCI+V2ViLUJhc2VkIFNjaG9sYXJzaGlwIFN1Ym1pc3Npb24gQWxlcnQgU3lzdGVtPC9oMT5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEzcHhdIGZvbnQtc2VtaWJvbGQgdGV4dC1ibHVlLTEwMFwiPlN0dWRlbnQgUG9ydGFsPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbXQtNCBtZDptdC0wXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIGJnLXdoaXRlLzIwIGhvdmVyOmJnLXdoaXRlLzMwIHRyYW5zaXRpb24tY29sb3JzIHB4LTQgcHktMiByb3VuZGVkLWZ1bGwgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICA8VXNlciBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtd2hpdGVcIiAvPlxuICAgICAgICAgICAge3VzZXI/LmVtYWlsIHx8ICdzdHVkZW50QGdtYWlsLmNvbSd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIGF3YWl0IGxvZ091dCgpO1xuICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdzdHVkZW50QXV0aCcpO1xuICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdzdHVkZW50VXNlcicpO1xuICAgICAgICAgICAgICBuYXZpZ2F0ZSgnL3N0dWRlbnQvbG9naW4nKTtcbiAgICAgICAgICB9fSBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIGJnLXdoaXRlLzIwIGhvdmVyOmJnLXdoaXRlLzMwIHRyYW5zaXRpb24tY29sb3JzIHB4LTYgcHktMiByb3VuZGVkLWZ1bGwgc2hhZG93LXNtIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICBMb2cgb3V0XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cInctZnVsbFwiPlxuICAgICAgICA8T3V0bGV0IC8+XG4gICAgICA8L21haW4+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHVkZW50RGFzaGJvYXJkKCkge1xuICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPHtpZDogc3RyaW5nLCBmaXJzdE5hbWU6IHN0cmluZywgbGFzdE5hbWU6IHN0cmluZywgZW1haWw/OiBzdHJpbmd9IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtvcGVuRHJvcGRvd24sIHNldE9wZW5Ecm9wZG93bl0gPSB1c2VTdGF0ZTwnMXN0JyB8ICcybmQnIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtmaWxlcywgc2V0RmlsZXNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgRmlsZSB8IG51bGw+Pih7fSk7XG4gIGNvbnN0IFtpc1N1Ym1pdHRpbmcsIHNldElzU3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93VG9hc3QsIHNldFNob3dUb2FzdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgLy8gSGFyZGNvZGUgYXZhaWxhYmxlIHNlbWVzdGVycyBmb3IgZGVtb25zdHJhdGlvbiAoMXN0IGlzIGF2YWlsYWJsZSwgMm5kIGlzIG5vdClcbiAgY29uc3QgYXZhaWxhYmxlU2VtZXN0ZXJzID0gWycxc3QnXTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNlc3Npb25TdHIgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdzdHVkZW50VXNlcicpO1xuICAgIGlmIChzZXNzaW9uU3RyKSB7XG4gICAgICBzZXRVc2VyKEpTT04ucGFyc2Uoc2Vzc2lvblN0cikpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IHRvZ2dsZURyb3Bkb3duID0gKHNlbTogJzFzdCcgfCAnMm5kJykgPT4ge1xuICAgIGlmICghYXZhaWxhYmxlU2VtZXN0ZXJzLmluY2x1ZGVzKHNlbSkpIHJldHVybjtcbiAgICBzZXRPcGVuRHJvcGRvd24ocHJldiA9PiBwcmV2ID09PSBzZW0gPyBudWxsIDogc2VtKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVGaWxlQ2hhbmdlID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+LCBrZXk6IHN0cmluZykgPT4ge1xuICAgIGlmIChlLnRhcmdldC5maWxlcyAmJiBlLnRhcmdldC5maWxlc1swXSkge1xuICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgc2V0RmlsZXMocHJldiA9PiAoeyAuLi5wcmV2LCBba2V5XTogZmlsZSB9KSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChzZW06ICcxc3QnIHwgJzJuZCcpID0+IHtcbiAgICBjb25zdCByZktleSA9IGAke3NlbX1fcmZgO1xuICAgIGNvbnN0IGd3YUtleSA9IGAke3NlbX1fZ3dhYDtcbiAgICBcbiAgICBpZiAoIWZpbGVzW3JmS2V5XSB8fCAhZmlsZXNbZ3dhS2V5XSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSB1cGxvYWQgYm90aCB0aGUgUmVnaXN0cmF0aW9uIEZvcm0gKFJGKSBhbmQgR2VuZXJhbCBXZWlnaHRlZCBBdmVyYWdlIChHV0EpIGRvY3VtZW50cy4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgc2V0SXNTdWJtaXR0aW5nKHRydWUpO1xuICAgIC8vIFNpbXVsYXRlIHN1Ym1pc3Npb24gZGVsYXlcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpO1xuICAgIFxuICAgIC8vIFNob3cgVG9hc3QgaW5zdGVhZCBvZiBhbGVydFxuICAgIHNldFNob3dUb2FzdCh0cnVlKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNldFNob3dUb2FzdChmYWxzZSksIDQwMDApO1xuICAgIFxuICAgIC8vIENsZWFyIHN0YXRlXG4gICAgc2V0RmlsZXMocHJldiA9PiAoeyAuLi5wcmV2LCBbcmZLZXldOiBudWxsLCBbZ3dhS2V5XTogbnVsbCB9KSk7XG4gICAgc2V0T3BlbkRyb3Bkb3duKG51bGwpO1xuICAgIHNldElzU3VibWl0dGluZyhmYWxzZSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmlsZUJ1dHRvbiA9IChrZXk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlc1trZXldO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgYm9yZGVyIGJvcmRlci1bIzljYTNhZl0gdGV4dC1bIzBjMjM0MF0gYmctWyNlZWYyZmZdIHB4LTQgcHktMiByb3VuZGVkLW1kIHRleHQtWzExcHhdIGZvbnQtc2VtaWJvbGQgaG92ZXI6YmctWyNlMGU3ZmZdIHRyYW5zaXRpb24tY29sb3JzIGN1cnNvci1wb2ludGVyIHctWzIyMHB4XSBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LXNtXCI+XG4gICAgICAgICAgPEltYWdlSWNvbiBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNSBzaHJpbmstMCB0ZXh0LVsjMWUzYThhXVwiIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidHJ1bmNhdGVcIj57ZmlsZS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJoaWRkZW5cIiBhY2NlcHQ9XCIucGRmLC5wbmcsLmpwZywuanBlZ1wiIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlRmlsZUNoYW5nZShlLCBrZXkpfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBib3JkZXIgYm9yZGVyLVsjOWNhM2FmXSB0ZXh0LVsjMGMyMzQwXSBiZy1bI2Y4ZmFmY10gcHgtNiBweS0yIHJvdW5kZWQtbWQgdGV4dC1bMTFweF0gZm9udC1ib2xkIGhvdmVyOmJnLVsjZTJlOGYwXSB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlciB3LVsyMjBweF0gc2hhZG93LXNtXCI+XG4gICAgICAgIDxVcGxvYWQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjUgc2hyaW5rLTBcIiAvPiBBZGQgRmlsZVxuICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJoaWRkZW5cIiBhY2NlcHQ9XCIucGRmLC5wbmcsLmpwZywuanBlZ1wiIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlRmlsZUNoYW5nZShlLCBrZXkpfSAvPlxuICAgICAgPC9sYWJlbD5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEwIG1heC13LVs5MDBweF0gbXgtYXV0byBtdC02IHBiLTMyIHJlbGF0aXZlXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWdyYWRpZW50LXRvLXIgZnJvbS1bIzNiODJmNl0gdG8tWyMxZTUwODhdIHJvdW5kZWQtWzEwcHhdIHB4LTEyIHB5LTEwIHRleHQtd2hpdGUgc2hhZG93LW1kIG14LTYgbWQ6bXgtMFwiPlxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC1bMzJweF0gZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0XCI+SGVsbG8sIHt1c2VyID8gYCR7dXNlci5maXJzdE5hbWV9ICR7dXNlci5sYXN0TmFtZX1gIDogJ0FubmEgU2FudG9zJ30hPC9oMj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNiBweC02IG1kOnB4LTBcIj5cbiAgICAgICAgey8qIENhcmQgMSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSByb3VuZGVkLWZ1bGwgcC01IHB4LTEyIHNoYWRvdy1bMF82cHhfMjVweF9yZ2IoMCwwLDAsMC4wOCldIGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGdhcC02IGgtWzExMHB4XVwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bMjJweF0gZm9udC1ib2xkIHRleHQtWyMwYzIzNDBdXCI+U2Nob2xhcnNoaXAgUmVxdWlyZW1lbnRzPC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS01MDAgbXQtMSB0ZXh0LXNtIG1kOnRleHQtYmFzZVwiPkZpbGwgdXAgYSBzY2hvbGFyc2hpcCBmb3JtIGFuZCB1cGxvYWQgdGhlIHJlcXVpcmVkIGRvY3VtZW50cyA8c3BhbiBjbGFzc05hbWU9XCJpdGFsaWMgZm9udC1tZWRpdW0gZm9udC1zZXJpZiB0ZXh0LWdyYXktNTAwXCI+KGZvciBuZXcgc3R1ZGVudHMgb25seSk8L3NwYW4+PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBuYXZpZ2F0ZSgnL3N0dWRlbnQvc3VibWlzc2lvbicpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMTIgcHktMy41IGJnLWdyYWRpZW50LXRvLXIgZnJvbS1bIzFlM2E4YV0gdG8tWyMzYjgyZjZdIHRleHQtd2hpdGUgcm91bmRlZC1mdWxsIGZvbnQtYm9sZCBob3ZlcjpvcGFjaXR5LTkwIHRyYW5zaXRpb24tb3BhY2l0eSBzaGFkb3ctc20gdy1hdXRvIG1pbi13LVsxNDBweF1cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIEVudGVyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBDYXJkIDIgd2l0aCBEcm9wZG93biAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFwicmVsYXRpdmVcIiwgb3BlbkRyb3Bkb3duID09PSAnMXN0JyA/IFwiei01MFwiIDogXCJ6LTEwXCIpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtZnVsbCBwLTUgcHgtMTIgc2hhZG93LVswXzZweF8yNXB4X3JnYigwLDAsMCwwLjA4KV0gZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZ2FwLTYgaC1bMTEwcHhdIHJlbGF0aXZlIHotMjBcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9e2NuKFwidGV4dC1bMjJweF0gZm9udC1ib2xkXCIsIGF2YWlsYWJsZVNlbWVzdGVycy5pbmNsdWRlcygnMXN0JykgPyBcInRleHQtWyMwYzIzNDBdXCIgOiBcInRleHQtWyM2YjcyODBdXCIpfT5cbiAgICAgICAgICAgICAgICAxc3QgU2VtZXN0ZXIgPHNwYW4gY2xhc3NOYW1lPXtjbihcInVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LVs2cHhdIGRlY29yYXRpb24tMlwiLCBhdmFpbGFibGVTZW1lc3RlcnMuaW5jbHVkZXMoJzFzdCcpID8gXCJ0ZXh0LVsjMGMyMzQwXVwiIDogXCJ0ZXh0LVsjOWNhM2FmXVwiKX0+KDIwMjYtMjAyNyk8L3NwYW4+XG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS01MDAgbXQtMSB0ZXh0LXNtIG1kOnRleHQtYmFzZVwiPlVwbG9hZCB0aGUgcmVxdWlyZWQgZG9jdW1lbnRzIDxzcGFuIGNsYXNzTmFtZT1cIml0YWxpYyBmb250LW1lZGl1bSBmb250LXNlcmlmIHRleHQtZ3JheS01MDBcIj4oZm9yIGN1cnJlbnQgc3R1ZGVudHMpPC9zcGFuPjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlRHJvcGRvd24oJzFzdCcpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWF2YWlsYWJsZVNlbWVzdGVycy5pbmNsdWRlcygnMXN0Jyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICAgXCJweC04IHB5LTMuNSByb3VuZGVkLWZ1bGwgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIGJvcmRlciB3LWF1dG8gbWluLXctWzE0MHB4XSB0cmFuc2l0aW9uLWNvbG9yc1wiLFxuICAgICAgICAgICAgICAgICFhdmFpbGFibGVTZW1lc3RlcnMuaW5jbHVkZXMoJzFzdCcpIFxuICAgICAgICAgICAgICAgICAgPyBcImJnLVsjZTJlOGYwXSB0ZXh0LVsjOTRhM2I4XSBib3JkZXItWyNjYmQ1ZTFdIGN1cnNvci1ub3QtYWxsb3dlZFwiIFxuICAgICAgICAgICAgICAgICAgOiBvcGVuRHJvcGRvd24gPT09ICcxc3QnXG4gICAgICAgICAgICAgICAgICAgID8gXCJiZy1bI2RiZWFmZV0gdGV4dC1bIzFlM2E4YV0gYm9yZGVyLVsjOTNjNWZkXVwiXG4gICAgICAgICAgICAgICAgICAgIDogXCJiZy1bI2RiZWFmZV0gdGV4dC1bIzFlM2E4YV0gYm9yZGVyLVsjOTNjNWZkXSBob3ZlcjpiZy1bI2JmZGJmZV1cIlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBTdWJtaXRcbiAgICAgICAgICAgICAge29wZW5Ecm9wZG93biA9PT0gJzFzdCcgPyAoXG4gICAgICAgICAgICAgICAgPENoZXZyb25VcCBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8Q2hldnJvbkRvd24gY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgICB7b3BlbkRyb3Bkb3duID09PSAnMXN0JyAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1bOTBweF0gcmlnaHQtNCB3LWZ1bGwgbWF4LXctWzY1MHB4XSBiZy13aGl0ZSByb3VuZGVkLTJ4bCBzaGFkb3ctWzBfMTBweF80MHB4X3JnYigwLDAsMCwwLjE1KV0gYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBwLTggcHQtMTAgei0xMCBhbmltYXRlLWluIGZhZGUtaW4gc2xpZGUtaW4tZnJvbS10b3AtNCBkdXJhdGlvbi0yMDBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgbWItNVwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtWyMwYzIzNDBdIHRleHQtWzE4cHhdIGxlYWRpbmctdGlnaHRcIj5SRjwvaDQ+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxNXB4XVwiPlJlZ2lzdHJhdGlvbiBGb3JtPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtyZW5kZXJGaWxlQnV0dG9uKCcxc3RfcmYnKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBtYi04XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMThweF0gbGVhZGluZy10aWdodFwiPkdXQTwvaDQ+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxNXB4XVwiPkdlbmVyYWwgV2VpZ2h0ZWQgQXZlcmFnZTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7cmVuZGVyRmlsZUJ1dHRvbignMXN0X2d3YScpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlU3VibWl0KCcxc3QnKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNTdWJtaXR0aW5nfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBiZy1bIzJiNGM4YV0gdGV4dC13aGl0ZSBweS0zLjUgcm91bmRlZC1sZyBmb250LWJvbGQgdGV4dC1bMTVweF0gaG92ZXI6YmctWyMxZTNhOGFdIHRyYW5zaXRpb24tY29sb3JzIHNoYWRvdy1zbSBkaXNhYmxlZDpvcGFjaXR5LTcwIGZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIGdhcC0yXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpc1N1Ym1pdHRpbmcgPyA8UmVmcmVzaEN3IGNsYXNzTmFtZT1cInctNSBoLTUgYW5pbWF0ZS1zcGluXCIgLz4gOiAnU3VibWl0J31cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQ2FyZCAzIHdpdGggRHJvcGRvd24gKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihcInJlbGF0aXZlXCIsIG9wZW5Ecm9wZG93biA9PT0gJzJuZCcgPyBcInotNTBcIiA6IFwiei0xMFwiKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSByb3VuZGVkLWZ1bGwgcC01IHB4LTEyIHNoYWRvdy1bMF82cHhfMjVweF9yZ2IoMCwwLDAsMC4wOCldIGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGdhcC02IGgtWzExMHB4XSByZWxhdGl2ZSB6LTIwXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPXtjbihcInRleHQtWzIycHhdIGZvbnQtYm9sZFwiLCBhdmFpbGFibGVTZW1lc3RlcnMuaW5jbHVkZXMoJzJuZCcpID8gXCJ0ZXh0LVsjMGMyMzQwXVwiIDogXCJ0ZXh0LVsjNmI3MjgwXVwiKX0+XG4gICAgICAgICAgICAgICAgMm5kIFNlbWVzdGVyIDxzcGFuIGNsYXNzTmFtZT17Y24oXCJ1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC1bNnB4XSBkZWNvcmF0aW9uLTJcIiwgYXZhaWxhYmxlU2VtZXN0ZXJzLmluY2x1ZGVzKCcybmQnKSA/IFwidGV4dC1bIzBjMjM0MF1cIiA6IFwidGV4dC1bIzljYTNhZl1cIil9PigyMDI2LTIwMjcpPC9zcGFuPlxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNTAwIG10LTEgdGV4dC1zbSBtZDp0ZXh0LWJhc2VcIj5VcGxvYWQgdGhlIHJlcXVpcmVkIGRvY3VtZW50cyA8c3BhbiBjbGFzc05hbWU9XCJpdGFsaWMgZm9udC1tZWRpdW0gZm9udC1zZXJpZiB0ZXh0LWdyYXktNTAwXCI+KGZvciBjdXJyZW50IHN0dWRlbnRzKTwvc3Bhbj48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZURyb3Bkb3duKCcybmQnKX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFhdmFpbGFibGVTZW1lc3RlcnMuaW5jbHVkZXMoJzJuZCcpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICAgIFwicHgtOCBweS0zLjUgcm91bmRlZC1mdWxsIGZvbnQtYm9sZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBib3JkZXIgdy1hdXRvIG1pbi13LVsxNDBweF0gdHJhbnNpdGlvbi1jb2xvcnNcIixcbiAgICAgICAgICAgICAgICAhYXZhaWxhYmxlU2VtZXN0ZXJzLmluY2x1ZGVzKCcybmQnKSBcbiAgICAgICAgICAgICAgICAgID8gXCJiZy1bI2UyZThmMF0gdGV4dC1bIzk0YTNiOF0gYm9yZGVyLVsjY2JkNWUxXSBjdXJzb3Itbm90LWFsbG93ZWRcIiBcbiAgICAgICAgICAgICAgICAgIDogb3BlbkRyb3Bkb3duID09PSAnMm5kJ1xuICAgICAgICAgICAgICAgICAgICA/IFwiYmctWyNkYmVhZmVdIHRleHQtWyMxZTNhOGFdIGJvcmRlci1bIzkzYzVmZF1cIlxuICAgICAgICAgICAgICAgICAgICA6IFwiYmctWyNkYmVhZmVdIHRleHQtWyMxZTNhOGFdIGJvcmRlci1bIzkzYzVmZF0gaG92ZXI6YmctWyNiZmRiZmVdXCJcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgU3VibWl0XG4gICAgICAgICAgICAgIHtvcGVuRHJvcGRvd24gPT09ICcybmQnID8gKFxuICAgICAgICAgICAgICAgIDxDaGV2cm9uVXAgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPENoZXZyb25Eb3duIGNsYXNzTmFtZT1cInctNSBoLTVcIiAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAge29wZW5Ecm9wZG93biA9PT0gJzJuZCcgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtWzkwcHhdIHJpZ2h0LTQgdy1mdWxsIG1heC13LVs2NTBweF0gYmctd2hpdGUgcm91bmRlZC0yeGwgc2hhZG93LVswXzEwcHhfNDBweF9yZ2IoMCwwLDAsMC4xNSldIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcC04IHB0LTEwIHotMTAgYW5pbWF0ZS1pbiBmYWRlLWluIHNsaWRlLWluLWZyb20tdG9wLTQgZHVyYXRpb24tMjAwXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIG1iLTVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxOHB4XSBsZWFkaW5nLXRpZ2h0XCI+UkY8L2g0PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gdGV4dC1bMTVweF1cIj5SZWdpc3RyYXRpb24gRm9ybTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7cmVuZGVyRmlsZUJ1dHRvbignMm5kX3JmJyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgbWItOFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtWyMwYzIzNDBdIHRleHQtWzE4cHhdIGxlYWRpbmctdGlnaHRcIj5HV0E8L2g0PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gdGV4dC1bMTVweF1cIj5HZW5lcmFsIFdlaWdodGVkIEF2ZXJhZ2U8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3JlbmRlckZpbGVCdXR0b24oJzJuZF9nd2EnKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVN1Ym1pdCgnMm5kJyl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctWyMyYjRjOGFdIHRleHQtd2hpdGUgcHktMy41IHJvdW5kZWQtbGcgZm9udC1ib2xkIHRleHQtWzE1cHhdIGhvdmVyOmJnLVsjMWUzYThhXSB0cmFuc2l0aW9uLWNvbG9ycyBzaGFkb3ctc20gZGlzYWJsZWQ6b3BhY2l0eS03MCBmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlciBnYXAtMlwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aXNTdWJtaXR0aW5nID8gPFJlZnJlc2hDdyBjbGFzc05hbWU9XCJ3LTUgaC01IGFuaW1hdGUtc3BpblwiIC8+IDogJ1N1Ym1pdCd9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgey8qIFRvYXN0IE5vdGlmaWNhdGlvbiAqL31cbiAgICAgIHtzaG93VG9hc3QgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGJvdHRvbS0xMCBsZWZ0LTEwIGJnLVsjYmJmN2QwXSBib3JkZXIgYm9yZGVyLVsjODZlZmFjXSBweC02IHB5LTMuNSByb3VuZGVkLWZ1bGwgc2hhZG93LWxnIGZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHotNTAgYW5pbWF0ZS1pbiBzbGlkZS1pbi1mcm9tLWJvdHRvbS01IGZhZGUtaW4gZHVyYXRpb24tMzAwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTYgaC02IGJnLVsjMTZhMzRhXSByb3VuZGVkLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgIDxDaGVjayBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtd2hpdGVcIiBzdHJva2VXaWR0aD17NH0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsjMTY2NTM0XSBmb250LWJvbGQgdGV4dC1bMTRweF1cIj5TdWNjZXNzZnVsbHkgc3VibWl0dGVkITwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBEaWdpdGFsU2lnbmF0dXJlUGFkKHtcbiAgdmFsdWUsXG4gIG9uQ2hhbmdlLFxuICBzdHVkZW50TmFtZVxufToge1xuICB2YWx1ZT86IHN0cmluZztcbiAgb25DaGFuZ2U6IChkYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHN0dWRlbnROYW1lOiBzdHJpbmc7XG59KSB7XG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVN0YXRlPCdkcmF3JyB8ICd0eXBlJyB8ICd1cGxvYWQnPignZHJhdycpO1xuICBjb25zdCBbdHlwZWROYW1lLCBzZXRUeXBlZE5hbWVdID0gdXNlU3RhdGUoc3R1ZGVudE5hbWUgfHwgJycpO1xuICBjb25zdCBjYW52YXNSZWYgPSB1c2VSZWY8SFRNTENhbnZhc0VsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2lzRHJhd2luZywgc2V0SXNEcmF3aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2hhc0RyYXduLCBzZXRIYXNEcmF3bl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobW9kZSA9PT0gJ2RyYXcnICYmIGNhbnZhc1JlZi5jdXJyZW50KSB7XG4gICAgICBjb25zdCBjYW52YXMgPSBjYW52YXNSZWYuY3VycmVudDtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgICAgIGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAzODg0JztcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDIuNTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFttb2RlXSk7XG5cbiAgY29uc3Qgc3RhcnREcmF3aW5nID0gKGU6IFJlYWN0LlBvaW50ZXJFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4pID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBjYW52YXNSZWYuY3VycmVudDtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICBzZXRJc0RyYXdpbmcodHJ1ZSk7XG4gICAgc2V0SGFzRHJhd24odHJ1ZSk7XG4gIH07XG5cbiAgY29uc3QgZHJhdyA9IChlOiBSZWFjdC5Qb2ludGVyRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+KSA9PiB7XG4gICAgaWYgKCFpc0RyYXdpbmcpIHJldHVybjtcbiAgICBjb25zdCBjYW52YXMgPSBjYW52YXNSZWYuY3VycmVudDtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICBjdHgubGluZVRvKHgsIHkpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfTtcblxuICBjb25zdCBzdG9wRHJhd2luZyA9ICgpID0+IHtcbiAgICBpZiAoIWlzRHJhd2luZykgcmV0dXJuO1xuICAgIHNldElzRHJhd2luZyhmYWxzZSk7XG4gICAgY29uc3QgY2FudmFzID0gY2FudmFzUmVmLmN1cnJlbnQ7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgY29uc3QgZGF0YVVybCA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgICAgb25DaGFuZ2UoZGF0YVVybCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsZWFyQ2FudmFzID0gKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGNhbnZhc1JlZi5jdXJyZW50O1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHJldHVybjtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgc2V0SGFzRHJhd24oZmFsc2UpO1xuICAgIG9uQ2hhbmdlKCcnKTtcbiAgfTtcblxuICBjb25zdCBnZW5lcmF0ZVR5cGVkU2lnbmF0dXJlID0gKHRleHQ6IHN0cmluZykgPT4ge1xuICAgIHNldFR5cGVkTmFtZSh0ZXh0KTtcbiAgICBpZiAoIXRleHQudHJpbSgpKSB7XG4gICAgICBvbkNoYW5nZSgnJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IDQwMDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gMTIwO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5mb250ID0gJ2l0YWxpYyBib2xkIDM0cHggXCJCcnVzaCBTY3JpcHQgTVRcIiwgXCJDYXZlYXRcIiwgXCJEYW5jaW5nIFNjcmlwdFwiLCBjdXJzaXZlLCBHZW9yZ2lhLCBzZXJpZic7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDM4ODQnO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIDIwMCwgNTUpO1xuICAgICAgXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDUwLCA5MCk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbygyMDAsIDEwMiwgMzUwLCA4NSk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMzg4NCc7XG4gICAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgY29uc3QgZGF0YVVybCA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgICAgb25DaGFuZ2UoZGF0YVVybCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVVwbG9hZFNpZ25hdHVyZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIGlmIChlLnRhcmdldC5maWxlcyAmJiBlLnRhcmdldC5maWxlc1swXSkge1xuICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICAgIG9uQ2hhbmdlKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgIH07XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjZjhmYWZmXSBib3JkZXItMiBib3JkZXItYmx1ZS0xMDAgcm91bmRlZC0yeGwgcC02IHNwYWNlLXktNCBzaGFkb3ctc21cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBzbTpmbGV4LXJvdyBzbTppdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zIGJvcmRlci1iIGJvcmRlci1ibHVlLTEwMCBwYi0zXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ib2xkIHRleHQtWyMwZjJlNjBdIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8UGVuVG9vbCBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtWyMxODY0ZGJdXCIgLz5cbiAgICAgICAgICAgIEFwcGxpY2FudCBEaWdpdGFsIFNpZ25hdHVyZVxuICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIG10LTAuNVwiPlNpZ24gZGlnaXRhbGx5IHVzaW5nIHlvdXIgbW91c2UvdG91Y2gsIHVwbG9hZCBhIHNpZ25hdHVyZSBpbWFnZSwgb3IgdHlwZSB5b3VyIG5hbWUuPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogSW5wdXQgTW9kZSBTZWxlY3RvciAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBiZy13aGl0ZSBwLTEgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWJsdWUtMjAwXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2RlKCdkcmF3Jyl9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICBcInB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGxcIixcbiAgICAgICAgICAgICAgbW9kZSA9PT0gJ2RyYXcnID8gXCJiZy1bIzE4NjRkYl0gdGV4dC13aGl0ZSBzaGFkb3cteHNcIiA6IFwidGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWJsdWUtOTAwXCJcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgRHJhd1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRNb2RlKCd0eXBlJyk7XG4gICAgICAgICAgICAgIGlmICh0eXBlZE5hbWUpIGdlbmVyYXRlVHlwZWRTaWduYXR1cmUodHlwZWROYW1lKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICBcInB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGxcIixcbiAgICAgICAgICAgICAgbW9kZSA9PT0gJ3R5cGUnID8gXCJiZy1bIzE4NjRkYl0gdGV4dC13aGl0ZSBzaGFkb3cteHNcIiA6IFwidGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWJsdWUtOTAwXCJcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgVHlwZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9kZSgndXBsb2FkJyl9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICBcInB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGxcIixcbiAgICAgICAgICAgICAgbW9kZSA9PT0gJ3VwbG9hZCcgPyBcImJnLVsjMTg2NGRiXSB0ZXh0LXdoaXRlIHNoYWRvdy14c1wiIDogXCJ0ZXh0LWdyYXktNjAwIGhvdmVyOnRleHQtYmx1ZS05MDBcIlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIE1vZGUgMTogRHJhdyBvbiBDYW52YXMgKi99XG4gICAgICB7bW9kZSA9PT0gJ2RyYXcnICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLWJsdWUtMjAwIGJnLXdoaXRlIHJvdW5kZWQteGwgb3ZlcmZsb3ctaGlkZGVuIGN1cnNvci1jcm9zc2hhaXIgc2hhZG93LWlubmVyXCI+XG4gICAgICAgICAgICA8Y2FudmFzXG4gICAgICAgICAgICAgIHJlZj17Y2FudmFzUmVmfVxuICAgICAgICAgICAgICB3aWR0aD17NTAwfVxuICAgICAgICAgICAgICBoZWlnaHQ9ezE0MH1cbiAgICAgICAgICAgICAgb25Qb2ludGVyRG93bj17c3RhcnREcmF3aW5nfVxuICAgICAgICAgICAgICBvblBvaW50ZXJNb3ZlPXtkcmF3fVxuICAgICAgICAgICAgICBvblBvaW50ZXJVcD17c3RvcERyYXdpbmd9XG4gICAgICAgICAgICAgIG9uUG9pbnRlckxlYXZlPXtzdG9wRHJhd2luZ31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtWzE0MHB4XSB0b3VjaC1ub25lIGJsb2NrXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7IWhhc0RyYXduICYmICF2YWx1ZSAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwb2ludGVyLWV2ZW50cy1ub25lIHRleHQtZ3JheS0zMDAgdGV4dC1zbSBmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAgICAgIFNpZ24gaGVyZSB3aXRoIG1vdXNlLCBmaW5nZXIsIG9yIHN0eWx1c1xuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICA8c3Bhbj5EcmF3IHlvdXIgbGVnYWwgc2lnbmF0dXJlIGluc2lkZSB0aGUgYm94PC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17Y2xlYXJDYW52YXN9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtcmVkLTYwMCBob3Zlcjp0ZXh0LXJlZC03MDAgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIGhvdmVyOnVuZGVybGluZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUcmFzaDIgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPiBDbGVhciBTaWduYXR1cmVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBNb2RlIDI6IFR5cGUgU2lnbmF0dXJlICovfVxuICAgICAge21vZGUgPT09ICd0eXBlJyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWdyYXktNzAwIG1iLTEuNVwiPlR5cGUgeW91ciBmdWxsIGxlZ2FsIG5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3R5cGVkTmFtZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBnZW5lcmF0ZVR5cGVkU2lnbmF0dXJlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIEp1YW4gRC4gRGVsYSBDcnV6XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IGJnLXdoaXRlIGJvcmRlciBib3JkZXItYmx1ZS0yMDAgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtbWVkaXVtIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLWJsdWUtNTAwIG91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt2YWx1ZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBiZy13aGl0ZSBib3JkZXIgYm9yZGVyLWJsdWUtMTAwIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWluLWgtWzEwMHB4XVwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz17dmFsdWV9IGFsdD1cIlR5cGVkIFNpZ25hdHVyZSBQcmV2aWV3XCIgY2xhc3NOYW1lPVwibWF4LWgtMjAgb2JqZWN0LWNvbnRhaW5cIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogTW9kZSAzOiBVcGxvYWQgU2lnbmF0dXJlIEZpbGUgKi99XG4gICAgICB7bW9kZSA9PT0gJ3VwbG9hZCcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItYmx1ZS0yMDAgYmctd2hpdGUgcm91bmRlZC14bCBwLTYgdGV4dC1jZW50ZXIgaG92ZXI6YmctYmx1ZS01MC81MCB0cmFuc2l0aW9uLWNvbG9ycyByZWxhdGl2ZSBncm91cFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVVcGxvYWRTaWduYXR1cmV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBvcGFjaXR5LTAgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMCBoLTEwIGJnLWJsdWUtMTAwIHRleHQtYmx1ZS02MDAgcm91bmRlZC1mdWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG14LWF1dG8gbWItMiBncm91cC1ob3ZlcjpzY2FsZS0xMTAgdHJhbnNpdGlvbi10cmFuc2Zvcm1cIj5cbiAgICAgICAgICAgICAgPFVwbG9hZCBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJvbGQgdGV4dC1ncmF5LTgwMFwiPlVwbG9hZCBzaWduYXR1cmUgaW1hZ2UgZmlsZTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMCBtdC0wLjVcIj5QTkcsIEpQRywgb3IgSlBFRyB3aXRoIGNsZWFuIGJhY2tncm91bmQ8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3ZhbHVlICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIGJnLXdoaXRlIGJvcmRlciBib3JkZXItYmx1ZS0xMDAgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt2YWx1ZX0gYWx0PVwiU2lnbmF0dXJlIFByZXZpZXdcIiBjbGFzc05hbWU9XCJoLTEyIHctMjggb2JqZWN0LWNvbnRhaW4gYm9yZGVyIGJvcmRlci1ncmF5LTEwMCByb3VuZGVkIHAtMSBiZy1ncmF5LTUwXCIgLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWdyZWVuLTcwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgPENoZWNrQ2lyY2xlMiBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+IFNpZ25hdHVyZSBBdHRhY2hlZFxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZSgnJyl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXJlZC02MDAgaG92ZXI6dGV4dC1yZWQtNzAwIGZvbnQtYm9sZFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBTaWduYXR1cmUgQ29uZmlybWF0aW9uIEJhbm5lciAqL31cbiAgICAgIHt2YWx1ZSA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ncmVlbi01MCBib3JkZXIgYm9yZGVyLWdyZWVuLTIwMCByb3VuZGVkLXhsIHAtMyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1ncmVlbi04MDAgZm9udC1ib2xkXCI+XG4gICAgICAgICAgICA8U2hpZWxkQ2hlY2sgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWdyZWVuLTYwMFwiIC8+XG4gICAgICAgICAgICA8c3Bhbj5EaWdpdGFsIFNpZ25hdHVyZSBWZXJpZmllZCAmIEFmZml4ZWQ8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1ncmF5LTUwMCBmb250LW1vbm8gdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgIHtuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tVVMnLCB7IG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgeWVhcjogJ251bWVyaWMnIH0pfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWFtYmVyLTUwIGJvcmRlciBib3JkZXItYW1iZXItMjAwIHJvdW5kZWQteGwgcC0zIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQteHMgdGV4dC1hbWJlci04MDAgZm9udC1tZWRpdW1cIj5cbiAgICAgICAgICA8QWxlcnRDaXJjbGUgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWFtYmVyLTYwMCBzaHJpbmstMFwiIC8+XG4gICAgICAgICAgPHNwYW4+UGxlYXNlIGFmZml4IHlvdXIgc2lnbmF0dXJlIGFib3ZlIGJlZm9yZSBzdWJtaXR0aW5nIHlvdXIgYXBwbGljYXRpb24uPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHVkZW50U3VibWlzc2lvbkZvcm0oKSB7XG4gIGNvbnN0IFtzY2hvbGFyc2hpcHMsIHNldFNjaG9sYXJzaGlwc10gPSB1c2VTdGF0ZTxhbnlbXT4oW10pO1xuICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gIGNvbnN0IFtzZWFyY2hQYXJhbXNdID0gdXNlU2VhcmNoUGFyYW1zKCk7XG4gIGNvbnN0IHNjaG9sYXJzaGlwSWQgPSBzZWFyY2hQYXJhbXMuZ2V0KCdzY2hvbGFyc2hpcElkJyk7XG4gIGNvbnN0IFtzZWxlY3RlZFNjaG9sYXJzaGlwLCBzZXRTZWxlY3RlZFNjaG9sYXJzaGlwXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG5cbiAgY29uc3QgW3N0ZXAsIHNldFN0ZXBdID0gdXNlU3RhdGUoMSk7XG4gIGNvbnN0IFtpc1N1Ym1pdHRpbmcsIHNldElzU3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93RXJyb3JzLCBzZXRTaG93RXJyb3JzXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlKHtcbiAgICBwaG90bzJ4MjogJycsXG4gICAgZmFtaWx5TmFtZTogJycsXG4gICAgbWlkZGxlTmFtZTogJycsXG4gICAgZmlyc3ROYW1lOiAnJyxcbiAgICBiaXJ0aGRhdGU6ICcnLFxuICAgIGFnZTogJycsXG4gICAgc2V4OiAnJyxcbiAgICB5ZWFyTGV2ZWw6ICcnLFxuICAgIGNvdXJzZTogJycsXG4gICAgc2VjdGlvbjogJycsXG4gICAgY29udGFjdE5vOiAnJyxcbiAgICBlbWFpbDogJycsXG4gICAgcGVybWFuZW50QWRkcmVzczogJycsXG4gICAgZmF0aGVyTmFtZTogJycsXG4gICAgZmF0aGVyT2NjdXBhdGlvbjogJycsXG4gICAgZmF0aGVyQ29udGFjdDogJycsXG4gICAgbW90aGVyTmFtZTogJycsXG4gICAgbW90aGVyT2NjdXBhdGlvbjogJycsXG4gICAgbW90aGVyQ29udGFjdDogJycsXG4gICAgZ3VhcmRpYW5OYW1lOiAnJyxcbiAgICBndWFyZGlhbk9jY3VwYXRpb246ICcnLFxuICAgIGd1YXJkaWFuQ29udGFjdDogJycsXG4gICAgXG4gICAgLy8gUGFnZSAyXG4gICAgaGlnaGVzdEVkdWNhdGlvbmFsQXR0YWlubWVudDogJycsXG4gICAgbW9udGhseUluY29tZTogJycsXG4gICAgZmlyc3RJbkZhbWlseVRvQXR0ZW5kQ29sbGVnZTogJycsXG4gICAgbGl2aW5nQ29uZGl0aW9uOiAnJyxcbiAgICBsaXZpbmdDb25kaXRpb25PdGhlcnM6ICcnLFxuICAgIHR5cGVPZkhvdXNpbmc6ICcnLFxuICAgIHR5cGVPZkhvdXNpbmdPdGhlcnM6ICcnLFxuICAgIFxuICAgIC8vIFBhZ2UgM1xuICAgIGFjY2Vzc1RvUmVzb3VyY2VzOiBbXSBhcyBzdHJpbmdbXSxcbiAgICB3b3JraW5nU3R1ZGVudDogJycsXG4gICAgc3R1ZGVudENsYXNzaWZpY2F0aW9uOiBbXSBhcyBzdHJpbmdbXSxcbiAgICBzdHVkZW50Q2xhc3NpZmljYXRpb25PdGhlcnM6ICcnLFxuICAgIFxuICAgIC8vIFBhZ2UgNFxuICAgIHR5cGVPZldvcmtPclNvdXJjZU9mSW5jb21lOiAnJyxcbiAgICBzcGVjaWFsTmVlZHNPckRpc2FiaWxpdHk6ICcnLFxuICAgIHBkbFJlYXNvbjogJycsXG4gICAgXG4gICAgc2Nob2xhcnNoaXBDYXRlZ29yeVR5cGU6ICcnLCAvLyBBLiBJbnRlcm5hbGx5LUZ1bmRlZCwgQi4gRXh0ZXJuYWxseS1GdW5kZWRcbiAgICBzY2hvbGFyc2hpcENhdGVnb3J5OiAnJyxcbiAgICBzY2hvbGFyc2hpcENhdGVnb3J5T3RoZXJzOiAnJyxcbiAgICBcbiAgICAvLyBQYWdlIDVcbiAgICBjb25ncmVzc2lvbmFsRGlzdHJpY3Q6ICcnLFxuICAgIG9uZVRvd25PbmVTY2hvbGFyOiAnJyxcbiAgICB0dWxvbmdEdW5vbmc6ICcnLFxuICAgIGxndUNvbnRhY3RQZXJzb246ICcnLFxuICAgIGRzd2RNdW5pY2lwYWxpdHk6ICcnLFxuICAgIGRzd2RDb250YWN0UGVyc29uOiAnJyxcbiAgICBkc3dkRGVzaWduYXRpb246ICcnLFxuICAgIGRzd2RPdGhlcnM6ICcnXG4gIH0pO1xuXG4gIGNvbnN0IGhhbmRsZUNoZWNrYm94Q2hhbmdlID0gKGZpZWxkOiBrZXlvZiB0eXBlb2YgZm9ybURhdGEsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBzZXRGb3JtRGF0YShwcmV2ID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBwcmV2W2ZpZWxkXSBhcyBzdHJpbmdbXTtcbiAgICAgIGlmIChjdXJyZW50LmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBbZmllbGRdOiBjdXJyZW50LmZpbHRlcih2ID0+IHYgIT09IHZhbHVlKSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ucHJldiwgW2ZpZWxkXTogWy4uLmN1cnJlbnQsIHZhbHVlXSB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgXG4gIGNvbnN0IFtmaWxlcywgc2V0RmlsZXNdID0gdXNlU3RhdGU8YW55W10+KFtdKTtcbiAgY29uc3QgW3Nob3dUb2FzdCwgc2V0U2hvd1RvYXN0XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBoYW5kbGVDYXRlZ29yeUZpbGVVcGxvYWQgPSAoY2F0ZWdvcnk6IHN0cmluZywgZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICBpZiAoZS50YXJnZXQuZmlsZXMgJiYgZS50YXJnZXQuZmlsZXNbMF0pIHtcbiAgICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSBldmVudC50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IHNpemVTdHIgPSBmaWxlLnNpemUgPiAxMDI0ICogMTAyNCBcbiAgICAgICAgICAgPyBgJHsoZmlsZS5zaXplIC8gKDEwMjQgKiAxMDI0KSkudG9GaXhlZCgxKX0gTUJgIFxuICAgICAgICAgICA6IGAke01hdGgucm91bmQoZmlsZS5zaXplIC8gMTAyNCl9IEtCYDtcbiAgICAgICAgY29uc3QgbmV3RmlsZU9iaiA9IHtcbiAgICAgICAgICBpZDogYGZpbGUtJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSxcbiAgICAgICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICAgICAgc2l6ZTogc2l6ZVN0cixcbiAgICAgICAgICBkYXRhOiBkYXRhVXJsLFxuICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICBzdGF0dXM6ICdQZW5kaW5nJ1xuICAgICAgICB9O1xuICAgICAgICBzZXRGaWxlcyhwcmV2ID0+IHtcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZCA9IHByZXYuZmlsdGVyKGYgPT4gZi5jYXRlZ29yeSAhPT0gY2F0ZWdvcnkpO1xuICAgICAgICAgIHJldHVybiBbLi4uZmlsdGVyZWQsIG5ld0ZpbGVPYmpdO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmlsZVVwbG9hZCA9IChjYXRlZ29yeTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGZpbGVzLmZpbmQoZiA9PiBmLmNhdGVnb3J5ID09PSBjYXRlZ29yeSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyIGJvcmRlci1ncmF5LTIwMCByb3VuZGVkLWxnIHAtNiBiZy1ncmF5LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gbWItMVwiPntjYXRlZ29yeX08L2g0PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlBsZWFzZSB1cGxvYWQgYSBjbGVhciBzY2FubmVkIGNvcHkgb3IgcGhvdG8uPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIiBcbiAgICAgICAgICAgIGlkPXtgdXBsb2FkLSR7Y2F0ZWdvcnkucmVwbGFjZSgvW15hLXpBLVpdL2csICcnKX1gfSBcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiIFxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVDYXRlZ29yeUZpbGVVcGxvYWQoY2F0ZWdvcnksIGUpfSBcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBcbiAgICAgICAgICAgIGh0bWxGb3I9e2B1cGxvYWQtJHtjYXRlZ29yeS5yZXBsYWNlKC9bXmEtekEtWl0vZywgJycpfWB9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICBcImN1cnNvci1wb2ludGVyIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHB4LTUgcHktMi41IHJvdW5kZWQtZnVsbCBmb250LWJvbGQgdGV4dC1zbSB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctc21cIixcbiAgICAgICAgICAgICAgZmlsZSA/IFwiYmctWyNkYmVhZmVdIHRleHQtWyMxZTNhOGFdIGJvcmRlciBib3JkZXItWyNiZmRiZmVdXCIgOiBcImJnLXdoaXRlIHRleHQtZ3JheS03MDAgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBob3ZlcjpiZy1ncmF5LTUwXCJcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2ZpbGUgPyAoXG4gICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICA8SW1hZ2VJY29uIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtYXgtdy1bMTUwcHhdIHRydW5jYXRlXCI+e2ZpbGUubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICA8VXBsb2FkIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgICAgICA8c3Bhbj5BZGQgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG5cbiAgXG4gIGNvbnN0IHJlbmRlckNhcmQgPSAoY2F0ZWdvcnk6IHN0cmluZywgdGl0bGU6IHN0cmluZywgc3VidGl0bGU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlcy5maW5kKGYgPT4gZi5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxsYWJlbCBcbiAgICAgICAgICBjbGFzc05hbWU9XCJ3LVsyODBweF0gaC1bMTkwcHhdIGJnLVsjZjJmNmZmXSBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1bIzVkN2JiNV0gcm91bmRlZC0zeGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgY3Vyc29yLXBvaW50ZXIgaG92ZXI6YmctWyNlNmVkZmVdIHRyYW5zaXRpb24tY29sb3JzIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlblwiXG4gICAgICAgID5cbiAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiIFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlkZGVuXCIgXG4gICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qLC5wZGZcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVDYXRlZ29yeUZpbGVVcGxvYWQoY2F0ZWdvcnksIGUpfSBcbiAgICAgICAgICAvPlxuICAgICAgICAgIHtmaWxlID8gKFxuICAgICAgICAgICAgZmlsZS5kYXRhLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2UnKSA/IChcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2ZpbGUuZGF0YX0gYWx0PXt0aXRsZX0gY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXJcIiAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBwLTRcIj5cbiAgICAgICAgICAgICAgICA8RmlsZVRleHQgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHRleHQtWyM1ZDdiYjVdIG14LWF1dG8gbWItMlwiIC8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1bIzFlM2E4YV0gYnJlYWstYWxsXCI+e2ZpbGUubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiNjRcIiBoZWlnaHQ9XCI2NFwiIHZpZXdCb3g9XCIwIDAgNjQgNjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCI2NFwiIGhlaWdodD1cIjY0XCIgcng9XCIxMFwiIGZpbGw9XCIjODg5ZmM5XCIgLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMiA0OEwyOCAyOEwzOCA0MEw1MCAyNEw1MiA0OEgxMlpcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gZm9udC1ib2xkIHRleHQtWzE1cHhdXCI+e3RpdGxlfTwvcD5cbiAgICAgICAgICB7c3VidGl0bGUgJiYgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gZm9udC1ib2xkIGl0YWxpYyB0ZXh0LVsxMnB4XSBtdC0wLjVcIj57c3VidGl0bGV9PC9wPn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzZXNzaW9uU3RyID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnc3R1ZGVudFVzZXInKTtcbiAgICBpZiAoc2Vzc2lvblN0cikge1xuICAgICAgY29uc3QgcGFyc2VkVXNlciA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0cik7XG4gICAgICBzZXRVc2VyKHBhcnNlZFVzZXIpO1xuICAgICAgc2V0Rm9ybURhdGEocHJldiA9PiAoe1xuICAgICAgICAuLi5wcmV2LFxuICAgICAgICBmaXJzdE5hbWU6IHBhcnNlZFVzZXIuZmlyc3ROYW1lIHx8ICcnLFxuICAgICAgICBmYW1pbHlOYW1lOiBwYXJzZWRVc2VyLmxhc3ROYW1lIHx8ICcnLFxuICAgICAgICBlbWFpbDogcGFyc2VkVXNlci5lbWFpbCB8fCAnJ1xuICAgICAgfSkpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQ+KSA9PiB7XG4gICAgc2V0Rm9ybURhdGEoeyAuLi5mb3JtRGF0YSwgW2UudGFyZ2V0Lm5hbWVdOiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVSYWRpb0NoYW5nZSA9IChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBzZXRGb3JtRGF0YSh7IC4uLmZvcm1EYXRhLCBbbmFtZV06IHZhbHVlIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBob3RvVXBsb2FkID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0LmZpbGVzICYmIGUudGFyZ2V0LmZpbGVzWzBdKSB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xuICAgICAgICBzZXRGb3JtRGF0YSh7IC4uLmZvcm1EYXRhLCBwaG90bzJ4MjogZXZlbnQudGFyZ2V0Py5yZXN1bHQgYXMgc3RyaW5nIH0pO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdmFsaWRhdGVTdGVwMSA9ICgpID0+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IFtcbiAgICAgICdwaG90bzJ4MicsICdmYW1pbHlOYW1lJywgJ21pZGRsZU5hbWUnLCAnZmlyc3ROYW1lJywgJ2JpcnRoZGF0ZScsICdhZ2UnLCAnc2V4JyxcbiAgICAgICd5ZWFyTGV2ZWwnLCAnY291cnNlJywgJ3NlY3Rpb24nLCAnY29udGFjdE5vJywgJ2VtYWlsJywgJ3Blcm1hbmVudEFkZHJlc3MnLFxuICAgICAgJ2ZhdGhlck5hbWUnLCAnZmF0aGVyT2NjdXBhdGlvbicsICdmYXRoZXJDb250YWN0JyxcbiAgICAgICdtb3RoZXJOYW1lJywgJ21vdGhlck9jY3VwYXRpb24nLCAnbW90aGVyQ29udGFjdCcsXG4gICAgICAnZ3VhcmRpYW5OYW1lJywgJ2d1YXJkaWFuT2NjdXBhdGlvbicsICdndWFyZGlhbkNvbnRhY3QnXG4gICAgXTtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHJlcXVpcmVkKSB7XG4gICAgICBpZiAoIWZvcm1EYXRhW2tleSBhcyBrZXlvZiB0eXBlb2YgZm9ybURhdGFdKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVOZXh0ID0gKCkgPT4ge1xuICAgIGlmIChzdGVwID09PSAxKSB7XG4gICAgICBpZiAoIXZhbGlkYXRlU3RlcDEoKSkge1xuICAgICAgICBzZXRTaG93RXJyb3JzKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGVwID09PSAyKSB7XG4gICAgICBjb25zdCBoYXNJZCA9IGZpbGVzLnNvbWUoZiA9PiBmLmNhdGVnb3J5ID09PSAnVmFsaWQgU3R1ZGVudCBJRCcpO1xuICAgICAgY29uc3QgaGFzUmYgPSBmaWxlcy5zb21lKGYgPT4gZi5jYXRlZ29yeSA9PT0gJ1JlZ2lzdHJhdGlvbiBGb3JtIChSRiknKTtcbiAgICAgIGNvbnN0IGhhc0d3YSA9IGZpbGVzLnNvbWUoZiA9PiBmLmNhdGVnb3J5ID09PSAnR2VuZXJhbCBXZWlnaHRlZCBBdmVyYWdlIChHV0EpJyk7XG4gICAgICBpZiAoIWhhc0lkIHx8ICFoYXNSZiB8fCAhaGFzR3dhKSB7XG4gICAgICAgIGFsZXJ0KCdQbGVhc2UgdXBsb2FkIGFsbCByZXF1aXJlZCBmaWxlcyAoU3R1ZGVudCBJRCwgUkYsIGFuZCBHV0EpIGJlZm9yZSBwcm9jZWVkaW5nLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNldFN0ZXAocyA9PiBNYXRoLm1pbihzICsgMSwgMykpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVQcmV2ID0gKCkgPT4ge1xuICAgIHNldFN0ZXAocyA9PiBNYXRoLm1heChzIC0gMSwgMSkpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGVycm9yIHN0eWxpbmdcbiAgY29uc3QgZ2V0RXJyb3JQcm9wcyA9IChmaWVsZE5hbWU6IHN0cmluZywgZGVmYXVsdFRleHQ6IHN0cmluZyA9IFwiVGhpcyBmaWVsZCBpcyByZXF1aXJlZC5cIikgPT4ge1xuICAgIGNvbnN0IGlzRXJyb3IgPSBzaG93RXJyb3JzICYmICFmb3JtRGF0YVtmaWVsZE5hbWUgYXMga2V5b2YgdHlwZW9mIGZvcm1EYXRhXTtcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3NOYW1lOiBjbihcbiAgICAgICAgXCJ3LWZ1bGwgcHgtMyBweS0yIGJnLXdoaXRlIGJvcmRlciByb3VuZGVkLXNtIHRleHQtc20gdGV4dC1bIzBjMjM0MF0gZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLWJsdWUtNTAwXCIsXG4gICAgICAgIGlzRXJyb3IgPyBcImJvcmRlci1yZWQtNTAwXCIgOiBcImJvcmRlci1ncmF5LTMwMFwiXG4gICAgICApLFxuICAgICAgZXJyb3JNc2c6IGlzRXJyb3IgPyBkZWZhdWx0VGV4dCA6IG51bGxcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBzcGFjZS15LTggbXQtNiBwYi0yMFwiPlxuICAgICAgXG4gICAgICB7LyogMy1TdGVwIEluZGljYXRvciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC1bMjRweF0gc2hhZG93LXNtIGJvcmRlciBib3JkZXItZ3JheS0xMDAgcC04IGZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgIHsvKiBTdGVwIDEgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICBcInctMTYgaC0xNiByb3VuZGVkLTJ4bCBzaGFkb3ctWzBfNHB4XzEwcHhfcmdiYSgwLDAsMCwwLjEpXSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi0zIHRyYW5zaXRpb24tY29sb3JzXCIsXG4gICAgICAgICAgICBzdGVwID4gMSA/IFwiYmctWyMxMGI5ODFdIHRleHQtd2hpdGUgc2hhZG93LVswXzRweF8xMHB4X3JnYmEoMTYsMTg1LDEyOSwwLjQpXVwiIDogXCJiZy1bIzI1NjNlYl0gdGV4dC13aGl0ZVwiIFxuICAgICAgICAgICl9PlxuICAgICAgICAgICAge3N0ZXAgPiAxID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtZnVsbCB3LTggaC04IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgIDxDaGVjayBjbGFzc05hbWU9XCJ3LTUgaC01IHRleHQtWyMxMGI5ODFdXCIgc3Ryb2tlV2lkdGg9ezR9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPEVkaXQgY2xhc3NOYW1lPVwidy03IGgtN1wiIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICBcInRleHQtWzEwcHhdIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZVwiLFxuICAgICAgICAgICAgc3RlcCA+IDEgPyBcInRleHQtWyMxMGI5ODFdXCIgOiBcInRleHQtWyMwYzIzNDBdXCJcbiAgICAgICAgICApfT5TdHVkZW50IEluZm9ybWF0aW9uPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0yNCBoLVsycHhdIGJnLWdyYXktMzAwIG1iLTZcIj48L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIHsvKiBTdGVwIDIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICBcInctMTYgaC0xNiByb3VuZGVkLTJ4bCBzaGFkb3ctWzBfNHB4XzEwcHhfcmdiYSgwLDAsMCwwLjEpXSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi0zIHRyYW5zaXRpb24tY29sb3JzXCIsXG4gICAgICAgICAgICBzdGVwID49IDIgPyBcImJnLVsjMjU2M2ViXSB0ZXh0LXdoaXRlIHNoYWRvdy1bMF80cHhfMTBweF9yZ2JhKDM3LDk5LDIzNSwwLjQpXVwiIDogXCJiZy1bIzNiODJmNl0gdGV4dC13aGl0ZVwiIFxuICAgICAgICAgICl9PlxuICAgICAgICAgICAgPEZpbGVUZXh0IGNsYXNzTmFtZT1cInctNyBoLTdcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWyMwYzIzNDBdIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZVwiPlVwbG9hZCBGaWxlczwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMjQgaC1bMnB4XSBiZy1ncmF5LTMwMCBtYi02XCI+PC9kaXY+XG4gICAgICAgIFxuICAgICAgICB7LyogU3RlcCAzICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgXCJ3LTE2IGgtMTYgcm91bmRlZC0yeGwgc2hhZG93LVswXzRweF8xMHB4X3JnYmEoMCwwLDAsMC4xKV0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMyB0cmFuc2l0aW9uLWNvbG9yc1wiLFxuICAgICAgICAgICAgc3RlcCA+PSAzID8gXCJiZy1bIzI1NjNlYl0gdGV4dC13aGl0ZSBzaGFkb3ctWzBfNHB4XzEwcHhfcmdiYSgzNyw5OSwyMzUsMC40KV1cIiA6IFwiYmctWyMzYjgyZjZdIHRleHQtd2hpdGVcIlxuICAgICAgICAgICl9PlxuICAgICAgICAgICAgPEVkaXQgY2xhc3NOYW1lPVwidy03IGgtN1wiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gdGV4dC1bMTBweF0gZm9udC1ib2xkIHVwcGVyY2FzZSB0cmFja2luZy13aWRlXCI+UmV2aWV3PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICBcbiAgICAgIHtzdGVwID09PSAxICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTZcIj5cbiAgICAgICAgICB7LyogSGVhZGVyIEJhbm5lciAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgc2hhZG93LXNtIG92ZXJmbG93LWhpZGRlbiBib3JkZXItdC1bOHB4XSBib3JkZXItdC15ZWxsb3ctNDAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgdGV4dC1jZW50ZXIgcGItNlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC04IHBiLTRcIj5cbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtWzI4cHhdIGZvbnQtYm9sZCBmb250LXNlcmlmIHRleHQtWyMwMDAwMDBdXCI+U2Nob2xhcnNoaXAgUmVjb3JkIEZvcm08L2gxPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNzAwIHRleHQtc20gZm9udC1zZXJpZiBtdC0yIHB4LTEwXCI+XG4gICAgICAgICAgICAgICAgRGF0YSBhbmQgUGVyc29uYWwgSW5mb3JtYXRpb24gd2lsbCBiZSBrZXB0IHdpdGggdXRtb3N0IGNvbmZpZGVudGlhbGl0eSBhbmQgd2lsbCBiZSBwcm90ZWN0ZWQgdGhyb3VnaCBSQSAxMDE3MyBhbHNvIGtub3duIGFzPGJyLz5EYXRhIFByaXZhY3kgQWN0IG9mIDIwMTJcbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1bI2ZmZmJlYl0gYm9yZGVyIGJvcmRlci1bI2ZjZDM0ZF0gcm91bmRlZC1tZCBweC02IHB5LTMgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWyNkOTc3MDZdIHRleHQteHMgZm9udC1zZW1pYm9sZFwiPlxuICAgICAgICAgICAgICBQbGVhc2UgZmlsbCBvdXQgYWxsIHJlcXVpcmVkIGZpZWxkcyBhY2N1cmF0ZWx5IGFuZCBjb21wbGV0ZWx5LiBUaGlzIGZvcm0gd2lsbCBiZSByZXZpZXdlZCBieSB0aGUgR3VpZGFuY2UgT2ZmaWNlIHByaW9yIHRvIHByb2Nlc3NpbmcuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjMWUzYThhXSByb3VuZGVkLWxnIHB5LTMgdGV4dC1jZW50ZXIgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LWJvbGQgdGV4dC1zbSB0cmFja2luZy13aWRlciB1cHBlcmNhc2VcIj5TdHVkZW50IERlbW9ncmFwaGljczwvaDI+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogU2VjdGlvbiBBICYgQiAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1bIzk0YTNiOF0gb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1bI2RiZWFmZV0gcHgtNCBweS0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGJvcmRlci1iIGJvcmRlci1bIzk0YTNiOF1cIj5cbiAgICAgICAgICAgICAgPFVzZXIgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LVsjMWUzYThhXVwiIC8+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsjMWUzYThhXSBmb250LWJvbGQgdGV4dC14cyB1cHBlcmNhc2VcIj5BLiBQZXJzb25hbCBJbmZvcm1hdGlvbiAmIEIuIEZhbWlseSBCYWNrZ3JvdW5kPC9oMz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBnYXAtOFwiPlxuICAgICAgICAgICAgICB7LyogTGVmdCBDb2x1bW4gKFBob3RvKSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICAgICAgXCJ3LVsxNDBweF0gaC1bMTQwcHhdIGJnLVsjZTJlOGYwXSBib3JkZXItMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBjdXJzb3ItcG9pbnRlciBvdmVyZmxvdy1oaWRkZW4gZ3JvdXAgcmVsYXRpdmVcIixcbiAgICAgICAgICAgICAgICAgIHNob3dFcnJvcnMgJiYgIWZvcm1EYXRhLnBob3RvMngyID8gXCJib3JkZXItcmVkLTUwMFwiIDogXCJib3JkZXItdHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgICl9PlxuICAgICAgICAgICAgICAgICAge2Zvcm1EYXRhLnBob3RvMngyID8gKFxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17Zm9ybURhdGEucGhvdG8yeDJ9IGFsdD1cIjJ4MlwiIGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyXCIgLz5cbiAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZUljb24gY2xhc3NOYW1lPVwidy0xMiBoLTEyIHRleHQtWyM5NGEzYjhdXCIgLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJoaWRkZW5cIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVBob3RvVXBsb2FkfSAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bIzFlM2E4YV0gdGV4dC1bMTFweF0gZm9udC1ib2xkIHVuZGVybGluZSBtdC0yXCI+MiB4IDIgUGljdHVyZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7c2hvd0Vycm9ycyAmJiAhZm9ybURhdGEucGhvdG8yeDIgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXJlZC02MDAgdGV4dC1bMTBweF0gZm9udC1ib2xkIG10LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgPEFsZXJ0VHJpYW5nbGUgY2xhc3NOYW1lPVwidy0zIGgtM1wiIC8+IEF0dGFjaCBpbWFnZS5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBSaWdodCBDb2x1bW4gKEZpZWxkcykgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgIHsvKiBSb3cgMTogTmFtZXMgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5GYW1pbHkgTmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmYW1pbHlOYW1lXCIgdmFsdWU9e2Zvcm1EYXRhLmZhbWlseU5hbWV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiZS5nLiBEZWxhIENydXpcIiBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2ZhbWlseU5hbWUnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPkZpcnN0IE5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmlyc3ROYW1lXCIgdmFsdWU9e2Zvcm1EYXRhLmZpcnN0TmFtZX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gcGxhY2Vob2xkZXI9XCJlLmcuIEp1YW5cIiBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2ZpcnN0TmFtZScpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+TWlkZGxlIE5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWlkZGxlTmFtZVwiIHZhbHVlPXtmb3JtRGF0YS5taWRkbGVOYW1lfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBwbGFjZWhvbGRlcj1cImUuZy4gU2FudG9zXCIgY2xhc3NOYW1lPXtnZXRFcnJvclByb3BzKCdtaWRkbGVOYW1lJykuY2xhc3NOYW1lfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogUm93IDI6IEJpcnRoZGF0ZSwgQWdlLCBTZXggKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0xMiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDpjb2wtc3Bhbi01IHJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPkJpcnRoZGF0ZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIG5hbWU9XCJiaXJ0aGRhdGVcIiB2YWx1ZT17Zm9ybURhdGEuYmlydGhkYXRlfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2JpcnRoZGF0ZScpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDpjb2wtc3Bhbi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPkFnZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmFtZT1cImFnZVwiIHZhbHVlPXtmb3JtRGF0YS5hZ2V9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiZS5nLiAxOFwiIGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnYWdlJykuY2xhc3NOYW1lfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1kOmNvbC1zcGFuLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+U2V4PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LVsjMGMyMzQwXSBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZXhcIiB2YWx1ZT1cIk1hbGVcIiBjaGVja2VkPXtmb3JtRGF0YS5zZXggPT09ICdNYWxlJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzZXgnLCAnTWFsZScpfSAvPiBNYWxlXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LVsjMGMyMzQwXSBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZXhcIiB2YWx1ZT1cIkZlbWFsZVwiIGNoZWNrZWQ9e2Zvcm1EYXRhLnNleCA9PT0gJ0ZlbWFsZSd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2V4JywgJ0ZlbWFsZScpfSAvPiBGZW1hbGVcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFJvdyAzOiBZZWFyIExldmVsLCBDb3Vyc2UsIFNlY3Rpb24gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5ZZWFyIExldmVsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwieWVhckxldmVsXCIgdmFsdWU9e2Zvcm1EYXRhLnllYXJMZXZlbH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPXtnZXRFcnJvclByb3BzKCd5ZWFyTGV2ZWwnKS5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgWWVhciBMZXZlbC4uLjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxc3QgWWVhclwiPjFzdCBZZWFyPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjJuZCBZZWFyXCI+Mm5kIFllYXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiM3JkIFllYXJcIj4zcmQgWWVhcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI0dGggWWVhclwiPjR0aCBZZWFyPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5Db3Vyc2U8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiY291cnNlXCIgdmFsdWU9e2Zvcm1EYXRhLmNvdXJzZX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gcGxhY2Vob2xkZXI9XCJlLmcuIEJTQ1NcIiBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2NvdXJzZScpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+U2VjdGlvbjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZWN0aW9uXCIgdmFsdWU9e2Zvcm1EYXRhLnNlY3Rpb259IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiZS5nLiAyQVwiIGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnc2VjdGlvbicpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFJvdyA0OiBDb250YWN0LCBFbWFpbCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPkNvbnRhY3QgTm8uPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImNvbnRhY3ROb1wiIHZhbHVlPXtmb3JtRGF0YS5jb250YWN0Tm99IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiZS5nLiAwOTEyMzQ1Njc4OVwiIGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnY29udGFjdE5vJykuY2xhc3NOYW1lfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5HbWFpbDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiB2YWx1ZT17Zm9ybURhdGEuZW1haWx9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiZS5nLiBqdWFuQGdtYWlsLmNvbVwiIGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnZW1haWwnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBSb3cgNTogUGVybWFuZW50IEFkZHJlc3MgKi99XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPlBlcm1hbmVudCBBZGRyZXNzPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwZXJtYW5lbnRBZGRyZXNzXCIgdmFsdWU9e2Zvcm1EYXRhLnBlcm1hbmVudEFkZHJlc3N9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiQ29tcGxldGUgcGVybWFuZW50IGFkZHJlc3NcIiBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ3Blcm1hbmVudEFkZHJlc3MnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPGhyIGNsYXNzTmFtZT1cIm15LTYgYm9yZGVyLWdyYXktMjAwXCIgLz5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gdXBwZXJjYXNlXCI+RmFtaWx5IEJhY2tncm91bmQ8L2g0PlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHsvKiBGYXRoZXIgKi99XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LVsjMGMyMzQwXSBtYi0yIGl0YWxpY1wiPkZhdGhlciBJbmZvcm1hdGlvbjwvaDU+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmF0aGVyTmFtZVwiIHZhbHVlPXtmb3JtRGF0YS5mYXRoZXJOYW1lfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2ZhdGhlck5hbWUnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPk9jY3VwYXRpb248L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmYXRoZXJPY2N1cGF0aW9uXCIgdmFsdWU9e2Zvcm1EYXRhLmZhdGhlck9jY3VwYXRpb259IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnZmF0aGVyT2NjdXBhdGlvbicpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+Q29udGFjdCBOby48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmYXRoZXJDb250YWN0XCIgdmFsdWU9e2Zvcm1EYXRhLmZhdGhlckNvbnRhY3R9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT17Z2V0RXJyb3JQcm9wcygnZmF0aGVyQ29udGFjdCcpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB7LyogTW90aGVyICovfVxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gbWItMiBpdGFsaWNcIj5Nb3RoZXIgSW5mb3JtYXRpb248L2g1PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1vdGhlck5hbWVcIiB2YWx1ZT17Zm9ybURhdGEubW90aGVyTmFtZX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPXtnZXRFcnJvclByb3BzKCdtb3RoZXJOYW1lJykuY2xhc3NOYW1lfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5PY2N1cGF0aW9uPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibW90aGVyT2NjdXBhdGlvblwiIHZhbHVlPXtmb3JtRGF0YS5tb3RoZXJPY2N1cGF0aW9ufSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ21vdGhlck9jY3VwYXRpb24nKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPkNvbnRhY3QgTm8uPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibW90aGVyQ29udGFjdFwiIHZhbHVlPXtmb3JtRGF0YS5tb3RoZXJDb250YWN0fSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ21vdGhlckNvbnRhY3QnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgey8qIEd1YXJkaWFuICovfVxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gbWItMiBpdGFsaWNcIj5HdWFyZGlhbiBJbmZvcm1hdGlvbjwvaDU+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC1bMTFweF0gZm9udC1ib2xkIG1iLTFcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZ3VhcmRpYW5OYW1lXCIgdmFsdWU9e2Zvcm1EYXRhLmd1YXJkaWFuTmFtZX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPXtnZXRFcnJvclByb3BzKCdndWFyZGlhbk5hbWUnKS5jbGFzc05hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgbWItMVwiPk9jY3VwYXRpb248L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJndWFyZGlhbk9jY3VwYXRpb25cIiB2YWx1ZT17Zm9ybURhdGEuZ3VhcmRpYW5PY2N1cGF0aW9ufSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2d1YXJkaWFuT2NjdXBhdGlvbicpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQtWzExcHhdIGZvbnQtYm9sZCBtYi0xXCI+Q29udGFjdCBOby48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJndWFyZGlhbkNvbnRhY3RcIiB2YWx1ZT17Zm9ybURhdGEuZ3VhcmRpYW5Db250YWN0fSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9e2dldEVycm9yUHJvcHMoJ2d1YXJkaWFuQ29udGFjdCcpLmNsYXNzTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgICB7LyogU2VjdGlvbiBDOiBMaXZpbmcgQ29uZGl0aW9uICYgRWR1Y2F0aW9uIGV0YyAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1bIzk0YTNiOF0gb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1bI2RiZWFmZV0gcHgtNCBweS0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGJvcmRlci1iIGJvcmRlci1bIzk0YTNiOF1cIj5cbiAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWyMxZTNhOGFdIGZvbnQtYm9sZCB0ZXh0LXhzIHVwcGVyY2FzZVwiPkMuIExpdmluZyBDb25kaXRpb24gJiBCYWNrZ3JvdW5kPC9oMz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgc3BhY2UteS02XCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQteHMgZm9udC1ib2xkIG1iLTJcIj5IaWdoZXN0IEVkdWNhdGlvbmFsIEF0dGFpbm1lbnQgb2YgeW91ciBQYXJlbnQvR3VhcmRpYW4/PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgICAge1snRWxlbWVudGFyeSBMZXZlbCcsICdFbGVtZW50YXJ5IEdyYWR1YXRlJywgJ0hpZ2ggc2Nob29sIEdyYWR1YXRlJywgJ0NvbGxlZ2UgR3JhZHVhdGUnLCAnSGlnaCBTY2hvb2wgTGV2ZWwnLCAnQ29sbGVnZSBMZXZlbCcsICdwb3N0IEdyYWR1YXRlIGxldmVsL2RlZ3JlZSddLm1hcChvcHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtvcHR9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJoaWdoZXN0RWR1Y2F0aW9uYWxBdHRhaW5tZW50XCIgdmFsdWU9e29wdH0gY2hlY2tlZD17Zm9ybURhdGEuaGlnaGVzdEVkdWNhdGlvbmFsQXR0YWlubWVudCA9PT0gb3B0fSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ2hpZ2hlc3RFZHVjYXRpb25hbEF0dGFpbm1lbnQnLCBvcHQpfSAvPiB7b3B0fVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC14cyBmb250LWJvbGQgbWItMlwiPldoYXQgaXMgeW91ciBmYW1pbHkncyBhcHByb3hpbWF0ZSBtb250aGx5IGluY29tZT88L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMiB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICB7WydiZWxvdyDigrEgMTAsMDAwJywgJ+KCsSAxMCwwMDEgLSDigrEgMjAsMDAwJywgJ+KCsSAyMCwwMDEgLSDigrEgMzAsMDAwJywgJ0Fib3ZlIOKCsSAzMCwwMDAnXS5tYXAob3B0ID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17b3B0fSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9udGhseUluY29tZVwiIHZhbHVlPXtvcHR9IGNoZWNrZWQ9e2Zvcm1EYXRhLm1vbnRobHlJbmNvbWUgPT09IG9wdH0gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdtb250aGx5SW5jb21lJywgb3B0KX0gLz4ge29wdH1cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC14cyBmb250LWJvbGRcIj5BcmUgeW91IHRoZSBmaXJzdCBpbiB0aGUgZmFtaWx5IHRvIGF0dGVuZCBDb2xsZWdlPzwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdGV4dC14cyBmb250LWJvbGQgdGV4dC1bIzBjMjM0MF0gY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZmlyc3RJbkZhbWlseVRvQXR0ZW5kQ29sbGVnZVwiIHZhbHVlPVwiWWVzXCIgY2hlY2tlZD17Zm9ybURhdGEuZmlyc3RJbkZhbWlseVRvQXR0ZW5kQ29sbGVnZSA9PT0gJ1llcyd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnZmlyc3RJbkZhbWlseVRvQXR0ZW5kQ29sbGVnZScsICdZZXMnKX0gLz4gWWVzXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LVsjMGMyMzQwXSBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJmaXJzdEluRmFtaWx5VG9BdHRlbmRDb2xsZWdlXCIgdmFsdWU9XCJOb1wiIGNoZWNrZWQ9e2Zvcm1EYXRhLmZpcnN0SW5GYW1pbHlUb0F0dGVuZENvbGxlZ2UgPT09ICdObyd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnZmlyc3RJbkZhbWlseVRvQXR0ZW5kQ29sbGVnZScsICdObycpfSAvPiBOb1xuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ib2xkIHRleHQtWyMwYzIzNDBdIHVwcGVyY2FzZSBtdC00IGJvcmRlci1iIHBiLTFcIj5DLiBMaXZpbmcgQ29uZGl0aW9uPC9oND5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQteHMgZm9udC1ib2xkIG1iLTJcIj5XaXRoIHdob20gZG8geW91IGN1cnJlbnRseSBsaXZlPzwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0yIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgIHtbJ1BhcmVudHMvR3VhcmRpYW5zJywgJ1JlbGF0aXZlcycsICdBbG9uZScsICdCb2FyZGluZyBob3VzZSddLm1hcChvcHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtvcHR9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJsaXZpbmdDb25kaXRpb25cIiB2YWx1ZT17b3B0fSBjaGVja2VkPXtmb3JtRGF0YS5saXZpbmdDb25kaXRpb24gPT09IG9wdH0gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdsaXZpbmdDb25kaXRpb24nLCBvcHQpfSAvPiB7b3B0fVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgY3Vyc29yLXBvaW50ZXIgY29sLXNwYW4tMlwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImxpdmluZ0NvbmRpdGlvblwiIHZhbHVlPVwib3RoZXJzXCIgY2hlY2tlZD17Zm9ybURhdGEubGl2aW5nQ29uZGl0aW9uID09PSAnb3RoZXJzJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdsaXZpbmdDb25kaXRpb24nLCAnb3RoZXJzJyl9IC8+IG90aGVycyAocGxlYXNlIHNwZWNpZnkpXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtRGF0YS5saXZpbmdDb25kaXRpb24gPT09ICdvdGhlcnMnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImxpdmluZ0NvbmRpdGlvbk90aGVyc1wiIHZhbHVlPXtmb3JtRGF0YS5saXZpbmdDb25kaXRpb25PdGhlcnN9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT1cIm1sLTIgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdGV4dC14cyBweC0xIHctNjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LXhzIGZvbnQtYm9sZCBtYi0yXCI+VHlwZSBvZiBIb3VzaW5nPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgZ2FwLTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgICAge1snT3duIGhvdXNlJywgJ1JlbnRlZCBob3VzZSBvciBhcGFydG1lbnQnLCAnQm9hcmRpbmcgaG91c2UnXS5tYXAob3B0ID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17b3B0fSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHlwZU9mSG91c2luZ1wiIHZhbHVlPXtvcHR9IGNoZWNrZWQ9e2Zvcm1EYXRhLnR5cGVPZkhvdXNpbmcgPT09IG9wdH0gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCd0eXBlT2ZIb3VzaW5nJywgb3B0KX0gLz4ge29wdH1cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHlwZU9mSG91c2luZ1wiIHZhbHVlPVwib3RoZXJzXCIgY2hlY2tlZD17Zm9ybURhdGEudHlwZU9mSG91c2luZyA9PT0gJ290aGVycyd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgndHlwZU9mSG91c2luZycsICdvdGhlcnMnKX0gLz4gb3RoZXJzIChwbGVhc2Ugc3BlY2lmeSlcbiAgICAgICAgICAgICAgICAgICAge2Zvcm1EYXRhLnR5cGVPZkhvdXNpbmcgPT09ICdvdGhlcnMnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInR5cGVPZkhvdXNpbmdPdGhlcnNcIiB2YWx1ZT17Zm9ybURhdGEudHlwZU9mSG91c2luZ090aGVyc30gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPVwibWwtMiBib3JkZXItYiBib3JkZXItZ3JheS00MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci1ibHVlLTUwMCB0ZXh0LXhzIHB4LTEgdy02NFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIHsvKiBTZWN0aW9uIEQgJiBFOiBSZXNvdXJjZXMgYW5kIENsYXNzaWZpY2F0aW9uICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLVsjOTRhM2I4XSBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LXNtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjZGJlYWZlXSBweC00IHB5LTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgYm9yZGVyLWIgYm9yZGVyLVsjOTRhM2I4XVwiPlxuICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bIzFlM2E4YV0gZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlXCI+RC4gQWNjZXNzIHRvIFJlc291cmNlcyAmIEUuIFN0dWRlbnQgQ2xhc3NpZmljYXRpb248L2gzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC14cyBmb250LWJvbGQgbWItMlwiPkQuIEFjY2VzcyB0byBSZXNvdXJjZXMgLSBEbyB5b3UgaGF2ZSBhY2Nlc3Mgb2YgdGhlIGZvbGxvd2luZyBhdCBob21lPzwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0yIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgIHtbJ1BlcnNvbmFsIENvbXB1dGVyL0xhcHRvcCcsICdJbnRlcm5ldCBDb25uZWN0aW9uJywgJ1N0dWR5IHNwYWNlJywgJ1RleHRib29rcyBhbmQgbGVhcm5pbmcgbWF0ZXJpYWxzJ10ubWFwKG9wdCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e29wdH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Zm9ybURhdGEuYWNjZXNzVG9SZXNvdXJjZXMuaW5jbHVkZXMob3B0KX0gb25DaGFuZ2U9eygpID0+IGhhbmRsZUNoZWNrYm94Q2hhbmdlKCdhY2Nlc3NUb1Jlc291cmNlcycsIG9wdCl9IC8+IHtvcHR9XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQteHMgZm9udC1ib2xkXCI+RG8geW91IHdvcmsgd2hpbGUgc3R1ZHlpbmc/PC9sYWJlbD5cbiAgICAgICAgICAgICAgICB7WydZZXMsIGZ1bGwtdGltZScsICdZZXMsIHBhcnQtdGltZScsICdObyddLm1hcChvcHQgPT4gKFxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17b3B0fSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRleHQteHMgZm9udC1ib2xkIHRleHQtWyMwYzIzNDBdIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwid29ya2luZ1N0dWRlbnRcIiB2YWx1ZT17b3B0fSBjaGVja2VkPXtmb3JtRGF0YS53b3JraW5nU3R1ZGVudCA9PT0gb3B0fSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3dvcmtpbmdTdHVkZW50Jywgb3B0KX0gLz4ge29wdH1cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1bIzBjMjM0MF0gdGV4dC14cyBmb250LWJvbGQgbWItMlwiPkUuIFN0dWRlbnQgQ2xhc3NpZmljYXRpb24gLSBXaGljaCBvZiB0aGUgZm9sbG93aW5nIGNsYXNzaWZpY2F0aW9uIGJlc3QgZGVzY3JpYmUgeW91ciBjdXJyZW50IHN0YXR1cz8gKE11bHRpcGxlIHJlc3BvbnNlcyk8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMiB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAnSW5kaWdlbm91cyBQZW9wbGVzIChJUHMpJywgJ1NvbG8gUGFyZW50JywgJ0NoaWxkIG9mIGEgc29sbyBwYXJlbnQnLCAnUGVyc29ucyB3aXRoIGRpc2FiaWxpdGllcyAoUFdEcyknLCAnQ2hpbGQgb2YgUGVyc29uIHdpdGggRGlzYWJpbGl0aWVzIChQV0QpJyxcbiAgICAgICAgICAgICAgICAgICAgJ0Ryb3Agb3V0IG9yIGxlYXJuZXIgd2hvIHJldHVybmVkIHRvIHNjaG9vbCcsICdDaGlsZCBvZiBkcm9wIG91dCBvciBsZWFybmVyIHdobyByZXR1cm5lZCB0byBzY2hvb2wnLCAnUmViZWwgcmV0dXJuZWVzJywgJ0NoaWxkIG9mIGEgcmViZWwgcmV0dXJuZWVzJyxcbiAgICAgICAgICAgICAgICAgICAgJ0RlcGVuZGVudCBvciBjaGlsZCBvZiBPRlcnLCAnTWVtYmVyIG9mIDRQcycsICdNZW1iZXIgb2YgQ2FsYW1pdHkgb3IgRGlzYXN0ZXIgQWZmZWN0ZWQgRmFtaWx5JywgJ09ycGhhbi9DaGlsZCBpbiBuZWVkIG9mIHNwZWNpYWwgcHJvdGVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICdXb3JraW5nIFN0dWRlbnQnLCAnRnJvbSBnZW9ncmFwaGljYWxseSBpc29sYXRlZCAmIGRpc2FkdmFudGFnZWQgYXJlYSAoR0lEQSknLCAnTXVzbGltIFN0dWRlbnQnLCAnTG93IGluY29tZSBmYW1pbHkvIEVjb25vbWljYWxseSBkaXNhZHZhbnRhZ2VkIHN0dWRlbnQnLFxuICAgICAgICAgICAgICAgICAgICAnU2VuaW9yIENpdGl6ZW4gc3R1ZGVudCcsICdGaXJzdCBHZW5lcmF0aW9uIHN0dWRlbnQgKFBhcmVudHMgZGlkIG5vdCBjb21wbGV0ZSBhIGNvbGxlZ2UgZGVncmVlLCBmaXJzdCBpbiB0aGUgaW1tZWRpYXRlIGZhbWlseSB0byBzZWVrIGNvbGxlZ2UgYWRtaXNzaW9uKScsXG4gICAgICAgICAgICAgICAgICAgICdMR0JUUSsgQ29tbXVuaXR5JywgJ1JlZ3VsYXIgc3R1ZGVudCAoSSBkbyBub3QgYmVsb25nIHRvIGFueSBvZiB0aGlzIGdyb3VwIGNsYXNzaWZpY2F0aW9uKSdcbiAgICAgICAgICAgICAgICAgIF0ubWFwKG9wdCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e29wdH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Zm9ybURhdGEuc3R1ZGVudENsYXNzaWZpY2F0aW9uLmluY2x1ZGVzKG9wdCl9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVDaGVja2JveENoYW5nZSgnc3R1ZGVudENsYXNzaWZpY2F0aW9uJywgb3B0KX0gLz4ge29wdH1cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGN1cnNvci1wb2ludGVyIGNvbC1zcGFuLTIgbXQtMVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Zm9ybURhdGEuc3R1ZGVudENsYXNzaWZpY2F0aW9uLmluY2x1ZGVzKCdvdGhlcnMnKX0gb25DaGFuZ2U9eygpID0+IGhhbmRsZUNoZWNrYm94Q2hhbmdlKCdzdHVkZW50Q2xhc3NpZmljYXRpb24nLCAnb3RoZXJzJyl9IC8+IG90aGVycyAoUGxlYXNlIHNwZWNpZnkpXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtRGF0YS5zdHVkZW50Q2xhc3NpZmljYXRpb24uaW5jbHVkZXMoJ290aGVycycpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInN0dWRlbnRDbGFzc2lmaWNhdGlvbk90aGVyc1wiIHZhbHVlPXtmb3JtRGF0YS5zdHVkZW50Q2xhc3NpZmljYXRpb25PdGhlcnN9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT1cIm1sLTIgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdGV4dC14cyBweC0xIHctNjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB7Zm9ybURhdGEuc3R1ZGVudENsYXNzaWZpY2F0aW9uLmluY2x1ZGVzKCdXb3JraW5nIFN0dWRlbnQnKSB8fCBmb3JtRGF0YS53b3JraW5nU3R1ZGVudC5zdGFydHNXaXRoKCdZZXMnKSA/IChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWyMwYzIzNDBdIHRleHQteHMgZm9udC1ib2xkIG1iLTFcIj5JZiB5b3UgYXJlIHdvcmtpbmcgc3R1ZGVudCwgcGxlYXNlIGluZGljYXRlIHlvdXIgdHlwZSBvZiB3b3JrIG9yIHNvdXJjZSBvZiBpbmNvbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInR5cGVPZldvcmtPclNvdXJjZU9mSW5jb21lXCIgdmFsdWU9e2Zvcm1EYXRhLnR5cGVPZldvcmtPclNvdXJjZU9mSW5jb21lfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdGV4dC14cyBweC0xIHB5LTFcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHtmb3JtRGF0YS5zdHVkZW50Q2xhc3NpZmljYXRpb24uaW5jbHVkZXMoJ1BlcnNvbnMgd2l0aCBkaXNhYmlsaXRpZXMgKFBXRHMpJykgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LXhzIGZvbnQtYm9sZCBtYi0xXCI+SWYgeW91IGFyZSBhIHN0dWRlbnQgd2l0aCBzcGVjaWFsIG5lZWRzL1BlcnNvbiB3aXRoIGRpc2FiaWxpdHkgKFBXRCksIHBsZWFzZSBzcGVjaWZ5IHlvdXIgY29uZGl0aW9uIG9yIGRpc2FiaWxpdHk8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNwZWNpYWxOZWVkc09yRGlzYWJpbGl0eVwiIHZhbHVlPXtmb3JtRGF0YS5zcGVjaWFsTmVlZHNPckRpc2FiaWxpdHl9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXItYiBib3JkZXItZ3JheS00MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci1ibHVlLTUwMCB0ZXh0LXhzIHB4LTEgcHktMVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAge2Zvcm1EYXRhLnN0dWRlbnRDbGFzc2lmaWNhdGlvbi5pbmNsdWRlcygnRHJvcCBvdXQgb3IgbGVhcm5lciB3aG8gcmV0dXJuZWQgdG8gc2Nob29sJykgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LVsjMGMyMzQwXSB0ZXh0LXhzIGZvbnQtYm9sZCBtYi0xXCI+SWYgeW91IGFyZSBhIFBETCAoRHJvcCBvdXQsIG9yIGxlYXJuZXIgd2l0aCBpbnRlcnJ1cHRlZCBzY2hvb2xpbmcpLCBwbGVhc2Ugc3RhdGUgdGhlIHJlYXNvbiB3aHkgeW91ciBzY2hvb2xpbmcgd2FzIHByZXZpb3VzbHkgaW50ZXJydXB0ZWQuPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwZGxSZWFzb25cIiB2YWx1ZT17Zm9ybURhdGEucGRsUmVhc29ufSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdGV4dC14cyBweC0xIHB5LTFcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIHsvKiBTZWN0aW9uIEY6IFNjaG9sYXJzaGlwIENhdGVnb3J5ICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLVsjOTRhM2I4XSBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LXNtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjZGJlYWZlXSBweC00IHB5LTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgYm9yZGVyLWIgYm9yZGVyLVsjOTRhM2I4XVwiPlxuICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bIzFlM2E4YV0gZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlXCI+U0NIT0xBUlNISVAgQ0FURUdPUlk8L2gzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IGJvcmRlci1iIGJvcmRlci1ncmF5LTIwMCBwYi00XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gZm9udC1ib2xkIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlUeXBlXCIgdmFsdWU9XCJBXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeVR5cGUgPT09ICdBJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5VHlwZScsICdBJyl9IC8+IEEuIEludGVybmFsbHktRnVuZGVkXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1zbSBmb250LWJvbGQgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVR5cGVcIiB2YWx1ZT1cIkJcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5VHlwZSA9PT0gJ0InfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnlUeXBlJywgJ0InKX0gLz4gQi4gRXh0ZXJuYWxseS1GdW5kZWRcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5VHlwZSA9PT0gJ0EnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXhzXCI+RW50cmFuY2U8L2g0PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIlZhbGVkaWN0b3JpYW5cIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnVmFsZWRpY3Rvcmlhbid9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdWYWxlZGljdG9yaWFuJyl9IC8+IFZhbGVkaWN0b3JpYW48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiU2FsdXRhdG9yaWFuXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ1NhbHV0YXRvcmlhbid9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdTYWx1dGF0b3JpYW4nKX0gLz4gU2FsdXRhdG9yaWFuPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQteHMgcHQtMlwiPkFjYWRlbWljPC9oND5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtNCB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzY2hvbGFyc2hpcENhdGVnb3J5XCIgdmFsdWU9XCJBY2FkZW1pYyBGdWxsXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ0FjYWRlbWljIEZ1bGwnfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCAnQWNhZGVtaWMgRnVsbCcpfSAvPiBGdWxsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIkFjYWRlbWljIFBhcnRpYWxcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnQWNhZGVtaWMgUGFydGlhbCd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdBY2FkZW1pYyBQYXJ0aWFsJyl9IC8+IFBhcnRpYWw8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiQWNhZGVtaWMgUmVnaW9uYWxcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnQWNhZGVtaWMgUmVnaW9uYWwnfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCAnQWNhZGVtaWMgUmVnaW9uYWwnKX0gLz4gUmVnaW9uYWw8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiQWNhZGVtaWMgTmF0aW9uYWxcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnQWNhZGVtaWMgTmF0aW9uYWwnfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCAnQWNhZGVtaWMgTmF0aW9uYWwnKX0gLz4gTmF0aW9uYWw8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC14cyBwdC0yXCI+U29jaW8tY3VsdHVyYWw8L2g0PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIlNvY2lvIFJlZ2lvbmFsXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ1NvY2lvIFJlZ2lvbmFsJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ1NvY2lvIFJlZ2lvbmFsJyl9IC8+IFJlZ2lvbmFsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIlNvY2lvIE5hdGlvbmFsXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ1NvY2lvIE5hdGlvbmFsJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ1NvY2lvIE5hdGlvbmFsJyl9IC8+IE5hdGlvbmFsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQteHMgcHQtMlwiPkluc3RpdHV0aW9uYWw8L2g0PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIkRlcGVuZGVudCBvZiBGYWN1bHR5IG9yIFN0YWZmXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ0RlcGVuZGVudCBvZiBGYWN1bHR5IG9yIFN0YWZmJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ0RlcGVuZGVudCBvZiBGYWN1bHR5IG9yIFN0YWZmJyl9IC8+IERlcGVuZGVudCBvZiBGYWN1bHR5IG9yIFN0YWZmPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIlByZXNpZGVudCAtIFNTQ1wiIGNoZWNrZWQ9e2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnkgPT09ICdQcmVzaWRlbnQgLSBTU0MnfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCAnUHJlc2lkZW50IC0gU1NDJyl9IC8+IFByZXNpZGVudCAtIFNTQzwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzY2hvbGFyc2hpcENhdGVnb3J5XCIgdmFsdWU9XCJQcmVzaWRlbnQgLSBGTFBcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnUHJlc2lkZW50IC0gRkxQJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ1ByZXNpZGVudCAtIEZMUCcpfSAvPiBQcmVzaWRlbnQgLSBGTFA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiRWRpdG9yLWluLUNoaWVmIChDYW1wdXMgUHVibGljYXRpb24pXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ0VkaXRvci1pbi1DaGllZiAoQ2FtcHVzIFB1YmxpY2F0aW9uKSd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdFZGl0b3ItaW4tQ2hpZWYgKENhbXB1cyBQdWJsaWNhdGlvbiknKX0gLz4gRWRpdG9yLWluLUNoaWVmIChDYW1wdXMgUHVibGljYXRpb24pPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIkNhcFNVIEJhbmQgLyBDaG9yYWxlXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ0NhcFNVIEJhbmQgLyBDaG9yYWxlJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ0NhcFNVIEJhbmQgLyBDaG9yYWxlJyl9IC8+IENhcFNVIEJhbmQgLyBDaG9yYWxlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB0LTIgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiT3RoZXJzIEludGVybmFsbHktRnVuZGVkXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ090aGVycyBJbnRlcm5hbGx5LUZ1bmRlZCd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdPdGhlcnMgSW50ZXJuYWxseS1GdW5kZWQnKX0gLz4gT3RoZXJzIChzcGVjaWZ5KTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIHtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnT3RoZXJzIEludGVybmFsbHktRnVuZGVkJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlPdGhlcnNcIiB2YWx1ZT17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeU90aGVyc30gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdy02NCBweC0xXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAge2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnlUeXBlID09PSAnQicgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQteHMgbWItMlwiPkNIRUQ8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgICAgICAgIHtbJ0FOQUMgLSBJUCcsICdQYWcgLSB1bGlraWQnLCAnQmFyYW5nYXkgKExlZ2FsIGRlcGVuZGVudHMgb2YgQnJneS4gT2ZmaWNpYWxzKScsICdFU0dQIC0gUEEnLCAnVW5pRmFzdCcsICdUZXJ0aWFyeSBFZHVjYXRpb24gU3Vic2lkeSAoVEVTKSddLm1hcChvcHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17b3B0fSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzY2hvbGFyc2hpcENhdGVnb3J5XCIgdmFsdWU9e29wdH0gY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gb3B0fSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCBvcHQpfSAvPiB7b3B0fTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIkNvbmdyZXNzaW9uYWwgRGlzdHJpY3RcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnQ29uZ3Jlc3Npb25hbCBEaXN0cmljdCd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdDb25ncmVzc2lvbmFsIERpc3RyaWN0Jyl9IC8+IENvbmdyZXNzaW9uYWwgRGlzdHJpY3QgKHNwZWNpZnkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ0NvbmdyZXNzaW9uYWwgRGlzdHJpY3QnICYmIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJjb25ncmVzc2lvbmFsRGlzdHJpY3RcIiB2YWx1ZT17Zm9ybURhdGEuY29uZ3Jlc3Npb25hbERpc3RyaWN0fSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJtbC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHctMzIgcHgtMVwiIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIk9uZSBUb3duIE9uZSBTY2hvbGFyXCIgY2hlY2tlZD17Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ09uZSBUb3duIE9uZSBTY2hvbGFyJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ09uZSBUb3duIE9uZSBTY2hvbGFyJyl9IC8+IE9uZSBUb3duIE9uZSBTY2hvbGFyIChzcGVjaWZ5KVxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnkgPT09ICdPbmUgVG93biBPbmUgU2Nob2xhcicgJiYgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm9uZVRvd25PbmVTY2hvbGFyXCIgdmFsdWU9e2Zvcm1EYXRhLm9uZVRvd25PbmVTY2hvbGFyfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJtbC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHctMzIgcHgtMVwiIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIlR1bG9uZyBEdW5vbmdcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnVHVsb25nIER1bm9uZyd9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsICdUdWxvbmcgRHVub25nJyl9IC8+IFR1bG9uZyBEdW5vbmcgKHNwZWNpZnkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybURhdGEuc2Nob2xhcnNoaXBDYXRlZ29yeSA9PT0gJ1R1bG9uZyBEdW5vbmcnICYmIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0dWxvbmdEdW5vbmdcIiB2YWx1ZT17Zm9ybURhdGEudHVsb25nRHVub25nfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJtbC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHctMzIgcHgtMVwiIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT1cIk90aGVycyBFeHRlcm5hbGx5LUZ1bmRlZFwiIGNoZWNrZWQ9e2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnkgPT09ICdPdGhlcnMgRXh0ZXJuYWxseS1GdW5kZWQnfSBvbkNoYW5nZT17KCkgPT4gaGFuZGxlUmFkaW9DaGFuZ2UoJ3NjaG9sYXJzaGlwQ2F0ZWdvcnknLCAnT3RoZXJzIEV4dGVybmFsbHktRnVuZGVkJyl9IC8+IE90aGVycyAoc3BlY2lmeSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnT3RoZXJzIEV4dGVybmFsbHktRnVuZGVkJyAmJiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXh0ZXJuYWxseUZ1bmRlZE90aGVyc1wiIHZhbHVlPXtmb3JtRGF0YS5leHRlcm5hbGx5RnVuZGVkT3RoZXJzfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJtbC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHctMzIgcHgtMVwiIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC14cyBtYi0yXCI+TWVyaXQ8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgICAgICAgIHtbJ1ZJQycsICdDYXBpemXDsW8gQ2lyY2xlJywgJ0RPU1QnLCAnR1JGJ10ubWFwKG9wdCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtvcHR9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNjaG9sYXJzaGlwQ2F0ZWdvcnlcIiB2YWx1ZT17b3B0fSBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSBvcHR9IG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVSYWRpb0NoYW5nZSgnc2Nob2xhcnNoaXBDYXRlZ29yeScsIG9wdCl9IC8+IHtvcHR9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzY2hvbGFyc2hpcENhdGVnb3J5XCIgdmFsdWU9XCJMR1VcIiBjaGVja2VkPXtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnTEdVJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ0xHVScpfSAvPiA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGRcIj5MR1U6PC9zcGFuPiBCYXJhbmdheSwgTXVuaWNpcGFsaXR5LCBQcm92aW5jZSAoTGFuZGxpbmUpIENvbnRhY3QgcGVyc29uIG9yIGlzc3Vpbmcgb2ZmaWNlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIHtmb3JtRGF0YS5zY2hvbGFyc2hpcENhdGVnb3J5ID09PSAnTEdVJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsZ3VDb250YWN0UGVyc29uXCIgdmFsdWU9e2Zvcm1EYXRhLmxndUNvbnRhY3RQZXJzb259IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IGNsYXNzTmFtZT1cInctZnVsbCBtdC0yIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHB4LTEgcHktMVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGJvcmRlciBwLTQgcm91bmRlZC1sZyBiZy1ncmF5LTUwIGJvcmRlci1ncmF5LTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBmb250LWJvbGQgbWItNFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2Nob2xhcnNoaXBDYXRlZ29yeVwiIHZhbHVlPVwiRFNXRFwiIGNoZWNrZWQ9e2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnkgPT09ICdEU1dEJ30gb25DaGFuZ2U9eygpID0+IGhhbmRsZVJhZGlvQ2hhbmdlKCdzY2hvbGFyc2hpcENhdGVnb3J5JywgJ0RTV0QnKX0gLz4gRFNXRDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge2Zvcm1EYXRhLnNjaG9sYXJzaGlwQ2F0ZWdvcnkgPT09ICdEU1dEJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgcGwtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTMyXCI+TXVuaWNpcGFsaXR5Ojwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRzd2RNdW5pY2lwYWxpdHlcIiB2YWx1ZT17Zm9ybURhdGEuZHN3ZE11bmljaXBhbGl0eX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPVwiZmxleC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHB4LTEgcHktMSBiZy10cmFuc3BhcmVudFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0zMlwiPkNvbnRhY3QgcGVyc29uOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRzd2RDb250YWN0UGVyc29uXCIgdmFsdWU9e2Zvcm1EYXRhLmRzd2RDb250YWN0UGVyc29ufSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJmbGV4LTEgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgcHgtMSBweS0xIGJnLXRyYW5zcGFyZW50XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTMyXCI+RGVzaWduYXRpb246PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZHN3ZERlc2lnbmF0aW9uXCIgdmFsdWU9e2Zvcm1EYXRhLmRzd2REZXNpZ25hdGlvbn0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gY2xhc3NOYW1lPVwiZmxleC0xIGJvcmRlci1iIGJvcmRlci1ncmF5LTQwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJsdWUtNTAwIHB4LTEgcHktMSBiZy10cmFuc3BhcmVudFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0zMlwiPk90aGVycyAoc3BlY2lmeSk6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZHN3ZE90aGVyc1wiIHZhbHVlPXtmb3JtRGF0YS5kc3dkT3RoZXJzfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBjbGFzc05hbWU9XCJmbGV4LTEgYm9yZGVyLWIgYm9yZGVyLWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgcHgtMSBweS0xIGJnLXRyYW5zcGFyZW50XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIG10LThcIj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gbmF2aWdhdGUoJy9zdHVkZW50L2xvZ2luJyl9IGNsYXNzTmFtZT1cImJnLWdyYXktMTAwIHRleHQtZ3JheS03MDAgcHgtNiBweS0zIHJvdW5kZWQtbWQgZm9udC1ib2xkIGhvdmVyOmJnLWdyYXktMjAwIHRyYW5zaXRpb24tY29sb3JzXCI+XG4gICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZU5leHR9IGNsYXNzTmFtZT1cImJnLVsjMWUzYThhXSB0ZXh0LXdoaXRlIHB4LTggcHktMyByb3VuZGVkLW1kIGZvbnQtYm9sZCBob3ZlcjpiZy1bIzFlNDBhZl0gdHJhbnNpdGlvbi1jb2xvcnMgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgIE5leHQgU3RlcFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbntzdGVwID09PSAyICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTZcIj5cbiAgICAgICAgICB7LyogSGVhZGVyIEJhbm5lciAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgc2hhZG93LXNtIG92ZXJmbG93LWhpZGRlbiBib3JkZXItdC1bOHB4XSBib3JkZXItdC1bI2Q5NzcwNl0gYm9yZGVyIGJvcmRlci1ncmF5LTIwMCB0ZXh0LWNlbnRlciBwYi02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB0LTggcGItNFwiPlxuICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1bMjhweF0gZm9udC1ib2xkIGZvbnQtc2VyaWYgdGV4dC1bIzAwMDAwMF1cIj5TY2hvbGFyc2hpcCBEb2N1bWVudHM8L2gxPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNzAwIHRleHQtc20gZm9udC1zZXJpZiBtdC0yIHB4LTEwXCI+XG4gICAgICAgICAgICAgICAgRGF0YSBhbmQgUGVyc29uYWwgSW5mb3JtYXRpb24gd2lsbCBiZSBrZXB0IHdpdGggdXRtb3N0IGNvbmZpZGVudGlhbGl0eSBhbmQgd2lsbCBiZSBwcm90ZWN0ZWQgdGhyb3VnaCBSQSAxMDE3MyBhbHNvIGtub3duIGFzPGJyLz5EYXRhIFByaXZhY3kgQWN0IG9mIDIwMTJcbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1bI2ZlZjNjN10gYm9yZGVyIGJvcmRlci1bI2ZjZDM0ZF0gcm91bmRlZC1tZCBweC02IHB5LTMgdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsjZDk3NzA2XSB0ZXh0LXhzIGZvbnQtc2VtaWJvbGRcIj5cbiAgICAgICAgICAgICAgVXBsb2FkIHRoZSBmb2xsb3dpbmcgcmVxdWlyZWQgc2Nob2xhcnNoaXAgZG9jdW1lbnRzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy1zbSBwdC0xNCBwYi0xNCBweC04XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0xMCBtYXgtdy1bNzAwcHhdIG14LWF1dG9cIj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdy1mdWxsIGdhcC04XCI+XG4gICAgICAgICAgICAgICAgICB7cmVuZGVyQ2FyZChcIlZhbGlkIFN0dWRlbnQgSURcIiwgXCJTdHVkZW50IElEXCIsIFwiXCIpfVxuICAgICAgICAgICAgICAgICAge3JlbmRlckNhcmQoXCJSZWdpc3RyYXRpb24gRm9ybSAoUkYpXCIsIFwiUkZcIiwgXCJSZWdpc3RyYXRpb24gRm9ybVwiKX1cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgICAge3JlbmRlckNhcmQoXCJHZW5lcmFsIFdlaWdodGVkIEF2ZXJhZ2UgKEdXQSlcIiwgXCJHV0FcIiwgXCJHZW5lcmFsIFdlaWdodGVkIEF2ZXJhZ2VcIil9XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIHsvKiBOYXYgQnV0dG9ucyAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIG10LTEwIHB4LThcIj5cbiAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVByZXZ9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLVsjMzA0MTZiXSB0ZXh0LXdoaXRlIHctMzIgcHktMy41IHJvdW5kZWQteGwgZm9udC1ib2xkIGhvdmVyOmJnLVsjMWUyZjVjXSB0cmFuc2l0aW9uLWNvbG9ycyBzaGFkb3ctbWQgdGV4dC1zbVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEJhY2tcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlTmV4dH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctWyMzMDQxNmJdIHRleHQtd2hpdGUgdy0zMiBweS0zLjUgcm91bmRlZC14bCBmb250LWJvbGQgaG92ZXI6YmctWyMxZTJmNWNdIHRyYW5zaXRpb24tY29sb3JzIHNoYWRvdy1tZCB0ZXh0LXNtXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgTmV4dFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge3N0ZXAgPT09IDMgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtOCByb3VuZGVkLWxnIHNoYWRvdy1zbSBib3JkZXIgYm9yZGVyLWdyYXktMjAwXCI+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCBtYi00XCI+UmV2aWV3ICYgU3VibWl0PC9oMj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNjAwIG1iLTZcIj5SZXZpZXcgeW91ciBpbmZvcm1hdGlvbiBiZWZvcmUgc3VibWl0dGluZy48L3A+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ncmF5LTUwIHAtNiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgc3BhY2UteS00IG1iLThcIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBmb250LWJvbGRcIj5BcHBsaWNhbnQgTmFtZTwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWyMwYzIzNDBdIGZvbnQtbWVkaXVtXCI+e2Zvcm1EYXRhLmZpcnN0TmFtZX0ge2Zvcm1EYXRhLm1pZGRsZU5hbWV9IHtmb3JtRGF0YS5mYW1pbHlOYW1lfTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBmb250LWJvbGRcIj5Db3Vyc2UgJiBZZWFyPC9wPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gZm9udC1tZWRpdW1cIj57Zm9ybURhdGEuY291cnNlfSAtIHtmb3JtRGF0YS55ZWFyTGV2ZWx9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIGZvbnQtYm9sZFwiPkNvbnRhY3Q8L3A+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsjMGMyMzQwXSBmb250LW1lZGl1bVwiPntmb3JtRGF0YS5jb250YWN0Tm99PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIGZvbnQtYm9sZFwiPkVtYWlsPC9wPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzBjMjM0MF0gZm9udC1tZWRpdW1cIj57Zm9ybURhdGEuZW1haWx9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBib3JkZXItdCBib3JkZXItZ3JheS0yMDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBmb250LWJvbGQgbWItMlwiPlVwbG9hZGVkIEZpbGVzPC9wPlxuICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgICB7ZmlsZXMubWFwKGYgPT4gKFxuICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2YuaWR9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gdGV4dC1bIzBjMjM0MF1cIj5cbiAgICAgICAgICAgICAgICAgICAgIDxDaGVja0NpcmNsZTIgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LVsjMTZhMzRhXVwiIC8+IHtmLmNhdGVnb3J5fTogPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj57Zi5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAge2ZpbGVzLmxlbmd0aCA9PT0gMCAmJiA8bGkgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwIGl0YWxpY1wiPk5vIGZpbGVzIHVwbG9hZGVkPC9saT59XG4gICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gbXQtOFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUHJldn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyIGJvcmRlci1ncmF5LTMwMCB0ZXh0LWdyYXktNzAwIHB4LTggcHktMyByb3VuZGVkLW1kIGZvbnQtYm9sZCBob3ZlcjpiZy1ncmF5LTUwIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQmFja1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0SXNTdWJtaXR0aW5nKHRydWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1Ym1pc3Npb25JZCA9IGBzdWItJHtEYXRlLm5vdygpfWA7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U3VibWlzc2lvbiA9IHtcbiAgICAgICAgICAgICAgICAgIGlkOiBzdWJtaXNzaW9uSWQsXG4gICAgICAgICAgICAgICAgICBzdHVkZW50SWQ6IHVzZXI/LnN0dWRlbnRJZCB8fCAnMjAyNC1DQVBTVS0wMDEnLFxuICAgICAgICAgICAgICAgICAgc3R1ZGVudE5hbWU6IGAke2Zvcm1EYXRhLmZpcnN0TmFtZX0gJHtmb3JtRGF0YS5taWRkbGVOYW1lID8gZm9ybURhdGEubWlkZGxlTmFtZSArICcgJyA6ICcnfSR7Zm9ybURhdGEuZmFtaWx5TmFtZX1gLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgIHNjaG9sYXJzaGlwVHlwZTogc2VsZWN0ZWRTY2hvbGFyc2hpcD8ubmFtZSB8fCAnQWNhZGVtaWMgU2Nob2xhcnNoaXAnLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnUGVuZGluZycgYXMgYW55LFxuICAgICAgICAgICAgICAgICAgc3VibWl0dGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBhd2FpdCBkYi5zdWJtaXNzaW9ucy5jcmVhdGUobmV3U3VibWlzc2lvbik7XG4gICAgICAgICAgICAgICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgc2V0U2hvd1RvYXN0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNob3dUb2FzdChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRlKCcvc3R1ZGVudC9kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICAgIH0sIDQwMDApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctWyMxNmEzNGFdIHRleHQtd2hpdGUgcHgtOCBweS0zIHJvdW5kZWQtbWQgZm9udC1ib2xkIGhvdmVyOmJnLVsjMTU4MDNkXSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpc1N1Ym1pdHRpbmcgPyAnU3VibWl0dGluZy4uLicgOiAnU3VibWl0IEFwcGxpY2F0aW9uJ31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7LyogVG9hc3QgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgIFwiZml4ZWQgYm90dG9tLTYgbGVmdC02IGZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGJnLXdoaXRlIGJvcmRlciBib3JkZXItWyMyMmM1NWVdIHRleHQtWyMxNjY1MzRdIHB4LTQgcHktMyByb3VuZGVkLWxnIHNoYWRvdy1bMF80cHhfMTJweF9yZ2JhKDM0LDE5Nyw5NCwwLjIpXSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgei01MFwiLFxuICAgICAgICBzaG93VG9hc3QgPyBcInRyYW5zbGF0ZS15LTAgb3BhY2l0eS0xMDBcIiA6IFwidHJhbnNsYXRlLXktOCBvcGFjaXR5LTAgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICApfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1bIzIyYzU1ZV0gdGV4dC13aGl0ZSByb3VuZGVkLWZ1bGwgcC0xXCI+XG4gICAgICAgICAgPENoZWNrIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW0gdGV4dC1zbVwiPlN1Y2Nlc3NmdWxseSBzdWJtaXR0ZWQhPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibWFwcGluZ3MiOiJBQWtHVSxTQXd3QkssVUF4d0JMO0FBbEdWLE9BQU8sU0FBUyxVQUFVLFFBQVEsaUJBQWlCO0FBQ25ELFNBQVMsUUFBYyxhQUFhLHVCQUF1QjtBQUMzRCxTQUFTLFVBQVU7QUFDbkI7QUFBQSxFQUFTO0FBQUEsRUFDQztBQUFBLEVBQVE7QUFBQSxFQUFjO0FBQUEsRUFBYTtBQUFBLEVBQVc7QUFBQSxFQUFNO0FBQUEsRUFDNUQ7QUFBQSxFQUFTO0FBQUEsRUFBNEM7QUFBQSxFQUFXO0FBQUEsRUFBTztBQUFBLEVBQzdELFNBQVM7QUFBQSxFQUF3QjtBQUFBLEVBQXVCO0FBQUEsRUFBZTtBQUFBLE9BQzVFO0FBQ1AsU0FBUyxVQUFVO0FBQ25CLFNBQVMsY0FBYztBQUV2QixTQUFTLGtCQUFrQixjQUFjO0FBRWxDLGdCQUFTLGVBQWU7QUFDN0IsUUFBTSxXQUFXLFlBQVk7QUFDN0IsUUFBTSxDQUFDLFNBQVMsVUFBVSxJQUFJLFNBQVMsSUFBSTtBQUUzQyxRQUFNLENBQUMsT0FBTyxRQUFRLElBQUksU0FBUyxFQUFFO0FBQ3JDLFFBQU0sQ0FBQyxVQUFVLFdBQVcsSUFBSSxTQUFTLEVBQUU7QUFDM0MsUUFBTSxDQUFDLFdBQVcsWUFBWSxJQUFJLFNBQVMsRUFBRTtBQUM3QyxRQUFNLENBQUMsVUFBVSxXQUFXLElBQUksU0FBUyxFQUFFO0FBQzNDLFFBQU0sQ0FBQyxPQUFPLFFBQVEsSUFBSSxTQUFTLEVBQUU7QUFFckMsUUFBTSxvQkFBb0IsWUFBWTtBQUNwQyxRQUFJO0FBQ0YsWUFBTSxTQUFTLE1BQU0saUJBQWlCO0FBRXRDLFVBQUksT0FBTyxNQUFNLEdBQUcsTUFBTSxZQUFZLE9BQU8sU0FBUyxFQUFFO0FBQ3hELFVBQUksQ0FBQyxNQUFNO0FBQ1QsZUFBTztBQUFBLFVBQ0wsSUFBSSxPQUFPO0FBQUEsVUFDWCxP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