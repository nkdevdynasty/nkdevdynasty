import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

/**
 * Helper to render Strapi Blocks text
 * This fixes the "Objects are not valid as a React child" error.
 */
function renderDescription(blocks: any) {
  if (!blocks || !Array.isArray(blocks)) return "";
  
  return blocks.map((block: any) => 
    block.children?.map((child: any) => child.text).join("")
  ).join("\n");
}

async function getTabData() {
  try {
    const res = await fetch(
      "http://strapi-y0c0kgs84s888k0ss40wskk8.89.167.10.11.sslip.io/api/about?populate=tabs",
      { 
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const json = await res.json();
    
    // Strapi v5 structure fix based on your console log
    if (!json || !json.data || !json.data.tabs) {
      console.warn("No tabs found in the response.");
      return [];
    }

    return json.data.tabs;
  } catch (error) {
    console.error("Error fetching Strapi data:", error);
    return [];
  }
}

export default async function Home() {
  const tabData = await getTabData();

  return (
    <>
      <Header />

      <main
        className="relative min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/building_2.jpg')",
        }}
      >
        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          Welcome to Saraswati Vidya Mandir
        </h1>

        <Carousel className="w-full max-w-4xl">
          <CarouselContent>
            {[
              "/images/s1.jpg", "/images/s2.jpg", "/images/s3.jpg",
              "/images/s4.jpg", "/images/s5.jpg", "/images/sdvm0.jpg",
            ].map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-[400px] object-cover rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="mt-16 w-full flex justify-center">
          {tabData.length > 0 ? (
            <Tabs defaultValue={tabData[0].title} className="w-full max-w-2xl">
              <TabsList className={`grid w-full grid-cols-${tabData.length}`}>
                {tabData.map((tab: any) => (
                  <TabsTrigger key={tab.id} value={tab.title}>
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabData.map((tab: any) => (
                <TabsContent key={tab.id} value={tab.title}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{tab.title}</CardTitle>
                      <CardDescription>
                        {/* FIX: Use the helper function here */}
                        {renderDescription(tab.description)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {tab.footerText}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center p-10 bg-white/80 rounded-lg">
              <p className="text-red-600 font-semibold">No content found in Strapi.</p>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-black mt-20 mb-6 text-center">
          College Toppers
        </h1>

        <Carousel className="w-full max-w-4xl mb-20">
          <CarouselContent>
            {[
              "/images/degree topers1.jpg", "/images/front 1.jpg",
              "/images/iit-2026.jpg", "/images/TEST-SERIES-25.jpg",
            ].map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-[300px] object-cover rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <Footer />
    </>
  );
}


