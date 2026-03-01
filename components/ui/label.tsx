import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";   // adjust path if needed
import Footer from "@/components/ui/footer";   // adjust path if needed

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-cover bg-center" 
      style={{ backgroundImage: "url('https://svmberhampur.com/wp-content/uploads/2023/05/slider1.jpg')" }}>
        <h1 className="text-4xl font-bold">Hello, World!</h1>
        <Button>Click me</Button>
      </main>

      <Footer />
    </>
  );
}                  


