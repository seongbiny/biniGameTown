import PageContainer from "../../components/layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/ui/Modal";

interface SignInFormData {
  username: string;
  password: string;
}

export default function SignInPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm<SignInFormData>();

  const { isOpen, openModal, closeModal } = useModal();

  // 입력값 감시
  const watchedValues = watch();
  const isFormValid =
    watchedValues.username?.trim() && watchedValues.password?.trim();

  const onSubmit = (data: SignInFormData) => {
    console.log("Sign up with:", data);
    // 회원가입 로직 추가
    openModal();
  };

  const handleModalButtonClick = () => {
    closeModal();
    navigate("/game");
  };

  return (
    <PageContainer>
      <div
        className="w-full h-full flex flex-col items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/bubble.png)",
        }}
      >
        {/* Back 버튼 */}
        <div className="w-full flex items-center justify-start px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xl text-black"
          >
            <img src="/icons/Arrow_left.svg" alt="Back" className="w-6 h-6" />
            <span>Back</span>
          </button>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-5 mt-9 p-6 bg-white/80 border-2 border-white rounded-[20px] w-[calc(100%-40px)] flex flex-col"
        >
          {/* Sign Up 제목 */}
          <div className="text-[28px] text-black mb-8">Sign In</div>

          {/* User Name 필드 */}
          <div className="mb-6">
            <label className="block text-base text-black mb-2 font-pixelify">
              User Name
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Enter user name"
              className="w-full px-4 py-3 bg-white border border-[#d9d9d9] rounded-lg text-base outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Password 필드 */}
          <div className="mb-6">
            <label className="block text-base text-black mb-2 font-pixelify">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white border border-[#d9d9d9] rounded-lg text-base outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Sign Up 버튼 - 조건부 활성화 */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full rounded-xl text-[24px] font-bold border-2 border-black py-2 transition-all duration-200 ${
              isFormValid
                ? "bg-[#FF7EB9] text-black hover:bg-[#E665A3] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            Sign In
          </button>

          {/* 하단 링크 */}
          <div className="mt-5 text-center">
            <p className="text-black text-base font-pixelify mb-2">
              Already have an account?
            </p>
            <a
              href="/signup"
              className="text-black text-lg font-pixelify underline hover:opacity-80 transition-opacity"
            >
              Sign Up
            </a>
          </div>
        </form>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title="Welcome back!"
          content="You're now logged in. Let's continue from where you last completed!"
          buttonText="Continue Game"
          onButtonClick={handleModalButtonClick}
        />
      </div>
    </PageContainer>
  );
}
