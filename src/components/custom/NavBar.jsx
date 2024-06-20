import React from "react";
import { Link } from "next/link";
export const NavBar = () => {
    const navMenu = [
        {
            lable: "Pricing",
            route: "/beta-register"
        },
        {
            lable: "About Us",
            route: "/beta-register"
        }
    ]
    return (

        <div className="navbar flex justify-between md:justify-evenly items-center p-3 pt-7 mb-[40px] md:mb-0">
            <div>

                <Link to="/"> 
                {/* <img src={logo} alt="" /> */}
                <p className="text-white font-semibold text-[24px]">PaperBrock.</p>
                </Link>
                
            </div>
          
            <div className="md:w-[40%] hidden w-full  md:block ">
                <ul className="flex justify-center h-6">
                    {
                        navMenu.map((nav) => {
                            return <li key={nav.lable} >
                                <Link to={nav.route}>
                                    <p className="mx-4 font-sans text-white font-normal hover:border-b-2">{nav.lable}</p>
                                </Link>
                            </li>
                        })
                    }
                </ul>


            </div>
            <div>
                <Link to="/user/sign-in" className="bg-white px-2.5 py-2 md:px-5 md:py-2 rounded-full hover:bg-blue-600 transition-all hover:text-white  text-black md:font-semibold font-normal ">Start For Free</Link>
            </div>

        </div>

    );
};

export default NavBar
