import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Login() {
  useDocumentTitle("Login");
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Login successful, navigating to dashboard');
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat [background-position:100%_center] p-4 transform scale-y-[-1]">
      <div className="flex items-center space-x-8 max-w-5xl w-full transform scale-y-[-1]">
        <div className="flex-1 flex justify-start items-center gap-4 items-end pb-60 ">
          <img src="/logo.svg" alt="Documed Logo" className="w-24" />
          <h1 className="font-bold text-5xl text-[#4C535F] ">DOCUMED</h1>
        </div>
        <Card className="flex-1 max-w-md">
          <CardContent className="p-10">
            <h2 className="text-3xl font-semibold mb-8">Sign in</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Enter your email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="py-6 px-4"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Enter your Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="py-6 px-4 pr-12"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full py-6">
                Sign in
              </Button>
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="link" className="bg-white px-2 text-xs text-gray-500 uppercase">
                    Forgot Password?
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full py-6 flex items-center bg-[#ECFCCB] hover:bg-[#D9FCAD] border-[#ECFCCB]">
                <svg className="w-5 h-5 mr-auto" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                <span className="flex-grow">Sign in with Google</span>
              </Button>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Button variant="link" className="p-0">
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
