import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { MdOutlineFingerprint } from "react-icons/md";
import { authApi } from "../../services/auth.service";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleChange = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const updated = { ...form, [field]: value };
      const newErrors: { email?: string; password?: string } = {};
      if (!updated.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updated.email))
        newErrors.email = "Enter a valid email address";
      if (!updated.password) newErrors.password = "Password is required";
      setErrors(newErrors);
    }
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await authApi.login(form);
      if (res.data.success) {
        toast.success(res.data.message || "Login successful");
        localStorage.setItem("token", res.data.data.accessToken);
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !validate().email && !validate().password && form.email && form.password;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
              <MdOutlineFingerprint className="text-3xl text-white" />
            </div>
          </div>

          <h1 className="mb-1 text-center text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mb-8 text-center text-sm text-blue-200/60">
            Sign in to your Finance Dashboard
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-300/70">
              Email
            </label>
            <div className={`relative flex items-center rounded-xl border bg-white/5 transition-all duration-200 focus-within:ring-2 ${
              touched.email && errors.email
                ? "border-red-500/70 focus-within:ring-red-500/30"
                : "border-white/10 focus-within:border-blue-400/50 focus-within:ring-blue-400/20"
            }`}>
              <AiOutlineMail className="ml-3.5 shrink-0 text-lg text-blue-300/50" />
              <input
                className="w-full bg-transparent p-3 pl-2.5 text-sm text-white placeholder-blue-200/30 focus:outline-none"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                autoComplete="email"
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-300/70">
              Password
            </label>
            <div className={`relative flex items-center rounded-xl border bg-white/5 transition-all duration-200 focus-within:ring-2 ${
              touched.password && errors.password
                ? "border-red-500/70 focus-within:ring-red-500/30"
                : "border-white/10 focus-within:border-blue-400/50 focus-within:ring-blue-400/20"
            }`}>
              <AiOutlineLock className="ml-3.5 shrink-0 text-lg text-blue-300/50" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent p-3 pl-2.5 pr-10 text-sm text-white placeholder-blue-200/30 focus:outline-none"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 text-lg text-blue-300/50 transition hover:text-blue-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin text-base" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-blue-200/50">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-400 transition hover:text-blue-300 hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Bottom accent line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}