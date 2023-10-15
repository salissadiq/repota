"use client"
import GlobalApi from '@/Shared/GlobalApi';
import BusinessList from '@/components/Home/BusinessList';
import CategoryList from '@/components/Home/CategoryList';
import GoogleMapView from '@/components/Home/GoogleMapView';
import RangeSelect from '@/components/Home/RangeSelect';
import SelectRating from '@/components/Home/SelectRating';
import SkeltonLoading from '@/components/SkeltonLoading';
import { UserLocationContext } from '@/context/UserLocationContext';
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react'

export default function Home() {
  const { data: session } = useSession();
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState(200);
  const [businessList, setBusinessList] = useState([])
  const [businessListOrg, setBusinessListOrg] = useState([])
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  // useEffect(() => {
  //   if (!session?.user) {
  //     router.push('/Login')
  //   }
  // }, [session])

  useEffect(() => {
    getGooglePlace();
  }, [category, radius])

  const getGooglePlace = () => {
    if (category) {
      setLoading(true)

      GlobalApi.getGooglePlace(category, radius, userLocation.lat, userLocation.lng).then(resp => {
        // console.log(resp.data.product.results);
        setBusinessList(resp.data.product.results);
        setBusinessListOrg(resp.data.product.results);
        setLoading(false)
      })
    }

  }

  const onRatingChange = (rating) => {
    if (rating.length == 0) {
      setBusinessList(businessListOrg);
    }
    const result = businessList.filter(item => {
      for (let i = 0; i < rating.length; i++) {
        if (item.rating >= rating[i]) {
          return true;

        }
        return false
      }
    })

    console.log(result)
  }
  return (
    <div>
      {category === ""
        ? <CategoryList onCategoryChange={(value) => setCategory(value)} />

        : <div className='grid 
    grid-cols-1
    md:grid-cols-4 '>

          <div className=' col-span-4'>
            <div
              className=" bg-gray-100 p-[6px] rounded-md
      w-[95%] gap-3 mx-2 my-2 flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent 
        outline-none w-full"
              />
            </div>
            <GoogleMapView businessList={businessList} />
            <div className=' mx-2 mt-[130px] w-[90%] bg- md:w-[74%]
           bottom-36 relative md:bottom-3'>
              {!loading ? <BusinessList businessList={businessList} />
                :
                <div className='flex gap-3'>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <SkeltonLoading key={index} />
                  ))}
                </div>
              }

            </div>
          </div>

        </div>}
    </div>
  )
}
