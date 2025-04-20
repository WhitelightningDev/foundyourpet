import React from "react";

const SignupSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-semibold mb-2">Signup Successful</h1>
            <p className="text-gray-700">Please check your email to verify your account and complete the signup process.</p>
        </div>
    );
};

export default SignupSuccess;
