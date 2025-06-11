import PageContainer from "../../components/layout/PageContainer";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div
        className="w-full h-full flex flex-col items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/bubble.png",
        }}
      >
        <div className="w-full flex items-center justify-start px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xl text-black"
          >
            <img src="/icons/Arrow_left.svg" alt="Back" className="w-6 h-6" />
            <span>Back</span>
          </button>
        </div>

        <div className="mx-5 mt-9 p-6 bg-white/80 border-2 border-white rounded-[20px] w-[calc(100%-40px)] flex flex-col">
          <div className="text-[28px] text-black mb-8">Sign Up</div>
          <div className="mb-6">
            <label className="block text-base text-black mb-2 font-pixelify">
              User Name
            </label>
            <input
              type="text"
              placeholder="Enter user name"
              className="w-full px-4 py-3 bg-white border border-[#d9d9d9] rounded-lg text-base outline-none focus:border-blue-500 transition-colors  placeholder:text-gray-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-base text-black mb-2 font-pixelify">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white border border-[#d9d9d9] rounded-lg text-base outline-none focus:border-blue-500 transition-colors  placeholder:text-gray-400"
            />
          </div>
          <button className="w-full bg-[#FF7EB9] text-black rounded-xl text-[24px] font-bold border-2 border-black py-2">
            Sign Up
          </button>

          <div className="mt-5 text-center">
            <p className="text-black text-base font-pixelify mb-2">
              Already have an account?
            </p>
            <a
              href="/signin"
              className="text-black text-lg font-pixelify underline hover:opacity-80 transition-opacity"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
