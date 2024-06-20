import React, { useEffect } from 'react'
import NavBar from "@/components/custom/NavBar"
// import datapage from '../../assets/landingpage/data-page-demo.svg'
// import dotss from '../../assets/dotss.svg'
// import roller from '../../assets/roller.svg'
// import waves from '../../assets/waves.svg'
// import step1 from '../../assets/landingpage/step1-block.svg'
// import step2 from '../../assets/landingpage/step2-block.svg'
// import step3 from '../../assets/landingpage/step3-block.svg'
import datapage from '../../public/assets/data-page-demo.svg'
import dotss from '../../public/assets/dotss.svg'
import roller from '../../public/assets/roller.svg'
import waves from '../../public/assets/waves.svg'
import step1 from '../../public/assets/step1-block.svg'
import step2 from '../../public/assets/step2-block.svg'
import step3 from '../../public/assets/step3-block.svg'
const Home = () => {

    return (
        <div className='flex justify-center flex-1 item-center flex-col flex-wrap w-full'>
            <div className='landing h-full w-full lg:bg-blue-mobile bg-image-tablet-laptop'>
                <NavBar />

                <div className='hero flex flex-col justify-center items-center'>
                    <div className='bg-white  rounded-full w-[200px] mt-3  mb-[5px] md:mt-5 md:mb-[-10px] p-[2px] flex'>
                        <div className='bg-[#0020CA] w-[70px] overflow-hidden rounded-full flex justify-center items-center '>
                            <p className='font-semibold text-white'>Beta</p>
                        </div>
                        <p className='ml-3 font-semibold text-center'>Lifetime Free</p>
                    </div>
                    <p className='text-white font-bold text-[37px] w-[340px] md:text-[62px] md:w-[1100px] text-center'>
                        Empower Your Exam Preparation with PaperBrock!
                    </p>
                </div>

                <div className='flex justify-center items-center mt-[40px]'>
                    <p className='text-white text-center w-[280px] md:w-[618px]'>Analyze PYQs, AI Answers, Craft Practice Papers—all in one: Your complete exam prep toolkit."
                    </p>
                </div>

               

                <div className='flex justify-center mt-6'>
                    <img src={datapage} className='w-[400px] h-[400px] md:w-[1100px] md:h-[830px]' alt="sdf" />
                </div>



            </div>

            <div className='hidden  md:block'>
                <img src={roller} alt="roller" className=' absolute right-[-100px] top-[900px] h-[300px] w-[400px] z-[-1] md:right-8 md:top-[1600px] ' />
            </div>
            <div className='hidden md:block'>
                <img src={waves} alt="roller" className='absolute right-[-100px] top-[1000px] h-[200px] w-[400px] z-[-1] md:left-3 md:top-[2700px] ' />
            </div>
            <div className='hidden  md:block '>
                <img src={dotss} alt="roller" className='hidden absolute right-[-100px] top-[1000px] h-[200px] w-[400px] z-[-1] md:right-8 md:top-[9800px] ' />
            </div>





            <div className='flex flex-col justify-center items-center md:mt-[130px]'>

                <div className='flex justify-center items-center text-center'>
                    <p className='text-black font-semibold mr-2 text-[30px] md:text-[44px]'>Swift your </p>
                    <p className='text-[#0500FF] font-semibold mr-1 text-[30px] md:text-[44px]'>performance</p>

                </div>
                <p className='text-center w-[65%] mt-5 text-gray-700 text-[12px] md:text-[20px]'>Unlock success with PaperBrock: PYQ insights, AI guidance, and hands-on practice in 5 simple steps.</p>

                <div className=' w-full h-full mt-[90px] gap-[400px]'>

                    <div className='grid justify-items-start w-full mb-[100px]'>
                        <div className='font-light w-[75%] flex justify-end text-[30px] md:text-[64px]'>
                            <p>Elevate Your Start</p>
                        </div>
                        <div className='flex items-end md:flex-row flex-col-reverse'>
                            <img src={step1} alt="paper upload dashboard" />
                            <p className='font-light text-[20px] md:text-[35px] ml-5 mb-5 md:w-[250px]  text-center md:text-left'>Launch your journey by seamlessly uploading exam papers</p>
                        </div>
                    </div>

                    <div className='grid justify-items-end w-full mb-[100px]'>
                        <div className='font-light w-[100%] flex justify-center md:justify-start text-[30px] md:text-[64px] text-center md:text-right md:w-[76%]'>
                            <p> Illuminate Your Strategy</p>
                        </div>
                        <div className='flex items-end justify-end md:flex-row flex-col '>
                            <p className='font-light text-[20px] md:text-[35px] mr-5 mb-5 md:w-[250px]  text-center md:text-right'>Illuminate your prep path with PYQ Statistics. Uncover exam trends, pinpoint vital topics, and strategize with precision.</p>
                            <img src={step2} alt="paper upload dashboard" />

                        </div>
                    </div>

                    <div className='grid justify-items-start w-full mb-[100px]'>
                        <div className='font-light w-full  md:w-[75%] flex justify-center md:justify-end text-[30px] md:text-[64px]'>
                            <p>AI Wisdom Unleashed</p>
                        </div>
                        <div className='flex items-end md:flex-row flex-col-reverse gap-4 md:gap-0'>
                            <img src={step3} alt="paper upload dashboard" />
                            <p className='font-light text-[20px] md:text-[35px] ml-5 md:w-[250px] text-center md:text-left'>Immerse in AI From dynamic doubt-solving to precision reference , it's your go-to for insightful</p>
                        </div>
                    </div>

                </div>
            </div>

            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <footer className='footer flex justify-center items-center py-4 bg-blue-800 text-white'>
                <p className='text-center'>© 2024 PaperBrock. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home