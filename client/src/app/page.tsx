import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* <Card /> */}
      {/* <h1 className='font-sans text-4xl font-normal text-center'>
        Xin chào mọi người
      </h1> */}
      <div className='w-[700px] h-[700px] bg-red-300'>
        {/* <Image
          src='/images/hinhdep.jpg'
          alt='hinhdep'
          width={200}
          height={200}
          quality={100} // Muốn hình nguyên gốc thì để 100
          className='w-[500px] h-[500px]'
        /> */}

        <Image
          src='https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='hinhdep'
          width={600}
          height={400}
          quality={100} // Muốn hình nguyên gốc thì để 100
          className='w-[500px] h-[500px]'
        />
      </div>
    </main>
  );
}
