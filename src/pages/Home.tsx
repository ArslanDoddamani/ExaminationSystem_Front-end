import { useNavigate } from "react-router-dom"
export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-black w-full h-screen flex flex-col justify-between">
                {/* Header Section */}
                <div className="w-full py-10">
                    <img
                        src="https://res.cloudinary.com/dbalgrwja/image/upload/v1734948202/BecLogo_cwt9lx.png"
                        alt="becLogo"
                        className="mx-auto w-12 md:w-16 lg:w-20"
                    />
                    <div className="mt-5 text-center text-white">
                        <h1 className="font-semibold text-sm md:text-lg">B.V.V SANGHA'S</h1>
                        <h1 className="font-semibold text-base md:text-xl lg:text-3xl">
                            BASAVESHWAR ENGINEERING COLLEGE, BAGALKOT-587103
                        </h1>
                    </div>
                </div>

                {/* Button Section */}
                <div className="h-44 flex flex-col justify-center items-center gap-4 px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg rounded-full px-8 py-3 transition-transform duration-300 transform hover:scale-105 hover:from-purple-500 hover:to-blue-500 shadow-md"
                            onClick={() => {
                                navigate('/login');
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg rounded-full px-8 py-3 transition-transform duration-300 transform hover:scale-105 hover:from-teal-500 hover:to-green-500 shadow-md"
                            onClick={() => {
                                navigate('/register');
                            }}
                        >
                            Register
                        </button>
                    </div>
                    <button
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg rounded-full px-8 py-3 mt-4 transition-transform duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-red-500 shadow-md"
                        onClick={() => {
                            navigate('/adminlogin');
                        }}
                    >
                        Login as Admin
                    </button>
                    <button
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg rounded-full px-8 py-3 mt-4 transition-transform duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-red-500 shadow-md"
                        onClick={() => {
                            navigate('/Facultylogin');
                        }}
                    >
                        Login as Faculty
                    </button>
                </div>

                {/* Footer Section */}
                <footer className="text-center text-gray-400 text-sm py-4">
                    © 2024 Basaveshwar Engineering College. All rights reserved.
                </footer>
            </div>

        </>
    )
}