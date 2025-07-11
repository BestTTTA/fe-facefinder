import Carousel from "@/components/Carousel";
import Search from "@/components/Search";
import ShowEvent from "@/components/ShowEvent";
import AlertBar from "@/components/AlertBar";
export default function Home() {
  return (
    <div className="flex flex-col gap-9">
      <AlertBar />
      <main className="flex w-full justify-center">
        <div className="flex flex-col items-center w-container gap-8">
          {/* <Carousel /> */}
          {/* <Search /> */}
          <h1 className="mb-2 text-2xl font-bold">อีเวนท์ล่าสุด</h1>
          <ShowEvent />
        </div>
      </main>
    </div>
  );
}
