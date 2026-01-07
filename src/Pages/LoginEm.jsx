import { SignInFormEm } from '../Components/UI/SignInFormEm';
import { SignUpFormEm } from '../Components/UI/SignUpFormEm';
import { useLogin } from '../Components/hooks/useLogin';

export default function LoginEm() {
    const { showSignIn, toggleForm } = useLogin();

    return (
        <div className="relative bg-gray-200 min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto max-h-[90vh] flex overflow-hidden">
                
                {showSignIn && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <SignInFormEm onToggleForm={toggleForm} />
                    </div>
                )}
    
                {!showSignIn && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <SignUpFormEm onToggleForm={toggleForm} />
                    </div>
                )}
            </div>
        </div>
    );
}
