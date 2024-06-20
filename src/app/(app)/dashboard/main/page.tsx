'use client'
import { useEffect, useState } from 'react';
import search from '@/assets/search.svg'
import Image from 'next/image';
import { ArrowUpRight, Search } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts'
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, } from '@/components/ui/card';
import { getRandomBlueShade } from '@/utils/getRandomBlueColor';

const UserProfile = () => {
  // input state for search
  const [searchValue, setSeachValue] = useState('')
  // output state for search 
  const [seachResult, setSearchResult] = useState([])
  // error message for search fail
  const [searchMessage, setSearchMessage] = useState('')
  // flag to show redirect card to search result
  const [showAnalyzeLink, setShowAnalyzeLink] = useState(false)

  // feed state

  const [feedData, setFeedData] = useState([])
  const debouncedUsername = useDebounceCallback(setSeachValue, 1000)
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  // next router
  const router = useRouter()

  // search query useEffect

  useEffect(() => {
    // redirect to analyze paper | show message | return | results 
    async function getSearchResult() {
      setLoading(true)
      try {
        if (!searchValue || searchValue.length == 0) {
          setSearchResult([]); // Clear the previous search results if the search query is empty
          return;
        }
        const results = await axios.get(`/api/get-exam-search?search=${searchValue}`)

        // show redirect card
        if (results.status == 300) {
          setShowAnalyzeLink(true)
          return;
        }
        // some error occure
        else if (!results || !results.data.success) {
          setSearchMessage(results.data.message)
        }

        // successfully add result to state
        setSearchResult(results.data.searchResults)
      } catch (error: any) {
        console.log(error.message, "is error")
        toast({
          variant: "destructive",
          title: "Something Went Wrong While Searching !",
          description: error.message
        })

      }
      finally {
        setLoading(false)
      }
    }
    getSearchResult()
  }, [searchValue])



  // get feed

  useEffect(() => {
    async function getFeedData() {
      try {
        const res = (await axios.get("/api/get-home-feed?page=1?limit=10")).data.data;
        setFeedData(res);

      } catch (error: any) {
        toast({
          title: "Can't Cook Feed For You",
          variant: "destructive"
        })
        throw new Error(error.message)
      }
    }

    getFeedData()
  }, [])

  return (
    <div className=' p-1 md:p-4'>
      {/* HEADING */}
      <div>
        <p className='hidden md:block font-medium text-primary text-xl'>Home</p>
      </div>

      {/* search section */}
      <div className='bg-blue-600 rounded-md h-full mt-5 flex justify-between items-center p-5 md:p-10 w-full'>

        {/* search bar */}
        <div className='w-full md:w-[75%] h-full flex flex-col gap-4'>
          <p className='text-white font-bold text-lg md:text-3xl'>Search Your Exam Analytics</p>
          <div className='w-full h-full md:h-10 bg-white rounded-md flex items-center py-2 px-1 gap-2 justify-between'>
            <div className=' pl-2 flex gap-4 w-full h-full items-center'>
              <Search color="#000000" strokeWidth={1.75} />
              <input
                onChange={(e) => {
                  console.log("changing");
                  debouncedUsername(e.target.value);
                }}
                type="text"
                className='w-[80%] h-full border-0 focus:outline-none focus:ring-0 focus:border-transparent bg-white'
                placeholder='Find Your Exam Analytics: Search for Insights and Reports'
              />

            </div>
            <div>
              <Button type='submit' onClick={() => {
                router.replace(`/result?search=${searchValue}`)
              }} size={"icon"} className='bg-blue-600 h-9'>
                <Search color="#ffffff" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
          {/* Display search results */}
          {seachResult.length > 0 && (
            <div className="z-20 fixed w-[80%] md:w-[57%] top-52 md:top-56 mt-4 mx-auto bg-white shadow-md rounded-md p-4">
              <ul>
                {seachResult.map((result: string, index) => {
                  // Convert result to string if it's not already a string
                  return (
                    <Button
                      onClick={() => router.replace(`/result?search=${result.replace(" ", "-")}`)}
                      key={index}
                      variant={"ghost"}
                      className='w-full flex justify-between p-4'
                    >
                      <div>{result}</div>
                      <ArrowUpRight />
                    </Button>
                  );
                })}
              </ul>
            </div>
          )}

        </div>

        {/* illustration */}
        <div className='w-[20%] hidden md:block'>
          <Image src={search} alt="Search illustration" />
        </div>

      </div>

      {/* cards */}
      <div>
        {feedData &&
          <div className='flex flex-col md:flex-row gap-2 w-full justify-center'>
            {
              feedData.map((cardData) => {
                const color = getRandomBlueShade();
                return <Card className='w-full md:w-1/4'>
                  {/* bg  */}
                  <div style={{ backgroundColor: color }} className={`w-full h-full bg-[${color}]`}>
                    dsfsd
                  </div>
                </Card>
              })
            }

          </div>
        }
      </div>

    </div>
  );
};

export default UserProfile;
