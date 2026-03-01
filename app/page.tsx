import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Image from "next/image";

// --- Types ---

interface StrapiTextChild {
  text: string;
  type?: string;
}

interface StrapiBlock {
  children?: StrapiTextChild[];
  type?: string;
}

interface TabData {
  id: number;
  title: string;
  description: StrapiBlock[]; // Strapi v5 Rich Text blocks
  footerText?: string;
}

// --- Helpers ---

/**
 * Helper to render Strapi Blocks text safely
 */
function renderDescription(blocks: StrapiBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) =>
      block.children?.map((child) => child.text).join("") || ""
    )
    .join("\n");
}

async function getTabData(): Promise<TabData[]> {
  try {
    const res = await fetch(
      "http://strapi-y0c0kgs84s888k0ss40wskk8.89.167.10.11.sslip.io/api/about?populate=tabs",
      {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      },
    );

    const json = await res.json();

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
              "/images/s1.jpg",
              "/images/s2.jpg",
              "/images/s3.jpg",
              "/images/s4.jpg",
              "/images/s5.jpg",
              "/images/sdvm0.jpg",
            ].map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Image
                    width={800} // Increased for better resolution
                    height={400}
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

        <div className="mt-16 w-full flex justify-center px-4">
          {tabData.length > 0 ? (
            <Tabs defaultValue={tabData[0].title} className="w-full max-w-2xl">
              {/* Dynamic grid cols based on tab count */}
              <TabsList 
                className="grid w-full" 
                style={{ gridTemplateColumns: `repeat(${tabData.length}, minmax(0, 1fr))` }}
              >
                {tabData.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.title}>
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabData.map((tab) => (
                <TabsContent key={tab.id} value={tab.title}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{tab.title}</CardTitle>
                      <CardDescription className="whitespace-pre-line">
                        {renderDescription(tab.description)}
                      </CardDescription>
                    </CardHeader>
                    {tab.footerText && (
                      <CardContent className="text-sm text-muted-foreground">
                        {tab.footerText}
                      </CardContent>
                    )}
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center p-10 bg-white/80 rounded-lg">
              <p className="text-red-600 font-semibold">
                No content found in Strapi.
              </p>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-black mt-20 mb-6 text-center">
          College Toppers
        </h1>

        <Carousel className="w-full max-w-4xl mb-20">
          <CarouselContent>
            {[
              "/images/degree topers1.jpg",
              "/images/front 1.jpg",
              "/images/iit-2026.jpg",
              "/images/TEST-SERIES-25.jpg",
            ].map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Image
                    width={800}
                    height={300}
                    src={src}
                    alt={`Topper ${index + 1}`}
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
