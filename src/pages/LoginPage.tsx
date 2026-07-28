import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/preproute-logo.svg";
import illustration from "../assets/login-illustration.svg";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await login(values.userId, values.password);
      setAuth(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen bg-preproute-bg overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Left side illustration */}
        <div className="flex md:w-[47.9167%] w-full md:h-full h-80 min-w-0 items-center justify-center overflow-hidden bg-preproute-bg">
          <img
            src={illustration}
            alt="Login illustration"
            className="w-[90%] md:w-full max-w-177.5 h-auto object-contain"
          />
        </div>

        {/* Right side login section */}
        <div className="w-full md:w-[52.0833%] h-screen box-border p-5 flex items-center justify-center overflow-hidden">
          {/* Login card */}
          <div className="w-full h-full max-w-177.5 box-border bg-white border-[0.5px] border-login-form-border rounded-xl flex items-center justify-center px-6 lg:px-[clamp(40px,6.94vw,100px)]">
            {/* Login content */}
            <div className="w-full max-w-127.5 flex flex-col gap-7.5">
              <div className="w-full flex flex-col gap-7.5">
                {/* Preproute logo */}
                <img
                  src={logo}
                  alt="Preproute"
                  className="w-[134.745px] h-[33.039px] object-contain"
                />

                {/* Login form */}
                <div className="w-full flex flex-col gap-7.5">
                  {/* Login heading and description */}
                  <div className="w-full max-w-65 flex flex-col gap-5">
                    <h1 className="m-0 text-xl font-semibold leading-[150%] text-text-gray">
                      Login
                    </h1>

                    <p className="m-0 text-xs font-normal leading-[150%] text-text-gray">
                      Use your company provided Login credentials
                    </p>
                  </div>

                  <form
                    id="login-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-7.5"
                  >
                    {/* User ID field */}
                    <div className="w-full flex flex-col gap-3.75">
                      <label
                        htmlFor="userId"
                        className="text-base font-medium leading-[150%] text-text-gray"
                      >
                        User ID
                      </label>

                      <input
                        id="userId"
                        autoComplete="username"
                        {...register("userId")}
                        placeholder="Enter User ID"
                        className="box-border w-full h-12 px-4 rounded-lg border-[0.5px] border-input-border bg-white text-base font-medium leading-[150%] text-text-gray placeholder:text-input-placeholder placeholder:font-medium outline-none focus:border-preproute-primary"
                      />

                      {errors.userId && (
                        <p className="text-xs text-red-500">
                          {errors.userId.message}
                        </p>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="w-full flex flex-col gap-3.75">
                      <div className="w-full flex flex-col gap-3.75">
                        <label
                          htmlFor="password"
                          className="text-base font-medium leading-[150%] text-text-gray"
                        >
                          Password
                        </label>

                        <input
                          id="password"
                          autoComplete="current-password"
                          type="password"
                          {...register("password")}
                          placeholder="Enter Password"
                          className="box-border w-full h-12 px-4 rounded-lg border-[0.5px] border-input-border bg-white text-base font-medium leading-[150%] text-text-gray placeholder:text-input-placeholder placeholder:font-medium outline-none focus:border-preproute-primary"
                        />
                      </div>

                      {errors.password && (
                        <p className="text-xs text-red-500">
                          {errors.password.message}
                        </p>
                      )}

                      {/* Password recovery */}
                      <a
                        href="#"
                        className="w-fit text-sm font-normal leading-[150%] text-primary-brand pt-3.75"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* API error message */}
                    {serverError && (
                      <p className="text-sm text-red-500">{serverError}</p>
                    )}
                  </form>
                </div>
              </div>

              {/* Submit login */}
              <button
                type="submit"
                form="login-form"
                disabled={isSubmitting}
                className="w-full h-12 shrink-0 rounded-xl bg-preproute-primary text-base font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
