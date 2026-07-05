import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineUser,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { authApi } from "../../services/auth.service";

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

// Password strength rules
const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",           test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A–Z)",       test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter (a–z)",       test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "One number (0–9)",                 test: (p: string) => /\d/.test(p) },
  { id: "special",   label: "One special character (!@#$…)",    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

function getStrengthLabel(score: number): { label: string; color: string; bg: string } {
  if (score <= 1) return { label: "Very weak",  color: "text-red-400",    bg: "bg-red-500" };
  if (score === 2) return { label: "Weak",       color: "text-orange-400", bg: "bg-orange-500" };
  if (score === 3) return { label: "Fair",       color: "text-yellow-400", bg: "bg-yellow-500" };
  if (score === 4) return { label: "Strong",     color: "text-lime-400",   bg: "bg-lime-500" };
  return            { label: "Very strong", color: "text-emerald-400", bg: "bg-emerald-500" };
}

export default function Register() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [showRules, setShowRules] = useState(false);

  const navigate = useNavigate();

  // Compute which rules pass
  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(form.password) })),
    [form.password]
  );
  const strengthScore = ruleResults.filter((r) => r.passed).length;
  const strengthInfo = getStrengthLabel(strengthScore);

  const validate = (data: FormState = form): FormErrors => {
    const errs: FormErrors = {};

    if (!data.name.trim()) {
      errs.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    if (!data.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Enter a valid email address";
    }

    if (!data.password) {
      errs.password = "Password is required";
    } else if (strengthScore < 5) {
      errs.password = "Password does not meet all requirements";
    }

    return errs;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
    if (field === "password" && !showRules && value.length > 0) setShowRules(true);
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validate());
  };

  const handleRegister = async () => {
    const allTouched = { name: true, email: true, password: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      const res = await authApi.register(form);
      if (res.data.success) {
        toast.success("Account created successfully! 🎉");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
        <AiOutlineCloseCircle className="shrink-0 text-sm" /> {msg}
      </p>
    ) : null;

  const fieldClass = (field: keyof FormState) =>
    `relative flex items-center rounded-xl border bg-white/5 transition-all duration-200 focus-within:ring-2 ${
      touched[field] && errors[field]
        ? "border-red-500/70 focus-within:ring-red-500/30"
        : "border-white/10 focus-within:border-emerald-400/50 focus-within:ring-emerald-400/20"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-4 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <MdOutlineRocketLaunch className="text-3xl text-white" />
            </div>
          </div>

          <h1 className="mb-1 text-center text-2xl font-bold tracking-tight text-white">
            Create account
          </h1>
          <p className="mb-8 text-center text-sm text-emerald-200/60">
            Join Finance App and take control
          </p>

          {/* NAME */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-emerald-300/70">
              Full Name
            </label>
            <div className={fieldClass("name")}>
              <AiOutlineUser className="ml-3.5 shrink-0 text-lg text-emerald-300/50" />
              <input
                className="w-full bg-transparent p-3 pl-2.5 text-sm text-white placeholder-emerald-200/30 focus:outline-none"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
            </div>
            <FieldError msg={touched.name ? errors.name : undefined} />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-emerald-300/70">
              Email
            </label>
            <div className={fieldClass("email")}>
              <AiOutlineMail className="ml-3.5 shrink-0 text-lg text-emerald-300/50" />
              <input
                className="w-full bg-transparent p-3 pl-2.5 text-sm text-white placeholder-emerald-200/30 focus:outline-none"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                autoComplete="email"
              />
            </div>
            <FieldError msg={touched.email ? errors.email : undefined} />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-emerald-300/70">
              Password
            </label>
            <div className={fieldClass("password")}>
              <AiOutlineLock className="ml-3.5 shrink-0 text-lg text-emerald-300/50" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent p-3 pl-2.5 pr-10 text-sm text-white placeholder-emerald-200/30 focus:outline-none"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 text-lg text-emerald-300/50 transition hover:text-emerald-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <FieldError msg={touched.password ? errors.password : undefined} />
          </div>

          {/* STRENGTH METER */}
          {showRules && form.password.length > 0 && (
            <div className="mb-5 mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
              {/* Bar */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= strengthScore ? strengthInfo.bg : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-semibold ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </span>
              </div>

              {/* Rules checklist */}
              <ul className="space-y-1.5">
                {ruleResults.map((rule) => (
                  <li key={rule.id} className="flex items-center gap-2 text-xs">
                    {rule.passed ? (
                      <AiOutlineCheckCircle className="shrink-0 text-sm text-emerald-400" />
                    ) : (
                      <AiOutlineCloseCircle className="shrink-0 text-sm text-white/20" />
                    )}
                    <span className={rule.passed ? "text-emerald-300" : "text-white/40"}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin text-base" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-emerald-200/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}