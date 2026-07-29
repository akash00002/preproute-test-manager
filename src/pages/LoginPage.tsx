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
      // Persist auth before routing so protected pages can render on the first pass.
      setAuth(response.data.token, response.data.user);
      navigate("/tests/create/chapterwise");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen md:overflow-hidden bg-preproute-bg">
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="flex w-full md:w-[47.9167%] h-56 md:h-full min-w-0 items-center justify-center bg-preproute-bg py-6 md:py-0">
          <img
            src={illustration}
            alt="Login illustration"
            className="w-[85%] max-w-sm md:max-w-177.5 md:w-full h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-[52.0833%] flex-1 md:h-screen p-4 md:p-5 flex items-start md:items-center justify-center">
          <div className="w-full md:h-full max-w-177.5 box-border bg-white border-[0.5px] border-login-form-border rounded-xl flex items-center justify-center px-5 md:px-6 lg:px-[clamp(40px,6.94vw,100px)] py-8 md:py-0">
            <div className="w-full max-w-127.5 flex flex-col gap-5 md:gap-7.5">
              <div className="w-full flex flex-col gap-5 md:gap-7.5">
                <img
                  src={logo}
                  alt="Preproute"
                  className="w-[134.745px] h-[33.039px] object-contain"
                />

                <div className="w-full flex flex-col gap-5 md:gap-7.5">
                  <div className="w-full max-w-66 flex flex-col gap-5">
                    <h1 className="m-0 text-xl font-semibold leading-[150%] text-text-gray">
                      Login
                    </h1>

                    <p className="m-0 w-full text-xs font-normal leading-[150%] text-text-gray">
                      Use your company provided Login credentials
                    </p>
                  </div>

                  <form
                    id="login-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-5 md:gap-7.5"
                  >
                    <div className="w-full flex flex-col gap-3 md:gap-3.75">
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

                    <div className="w-full flex flex-col gap-3 md:gap-3.75">
                      <div className="w-full flex flex-col gap-3 md:gap-3.75">
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

                      <a
                        href="#"
                        className="w-fit text-sm font-normal leading-[150%] text-primary-brand pt-3.75"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {serverError && (
                      <p className="text-sm text-red-500">{serverError}</p>
                    )}
                  </form>
                </div>
              </div>

              {/* The button sits outside the form to match the design spacing, so it targets the form by id. */}
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
