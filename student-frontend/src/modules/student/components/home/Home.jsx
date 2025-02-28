import HomeCarousel from './HomeCarousel'
import LeaveRequest from './LeaveRequest';
import MarksGraph from './MarksGraph';

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col mx-6 md:mr-0">
      {/* <HomeCarousel /> */}
      <h1 className='text-3xl font-bold py-8'>Overall Performance</h1>
      {/* <MarksGraph/> */}
      <LeaveRequest />
    </div>
  );
};

export default Home;
