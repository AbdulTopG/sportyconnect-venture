
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SportyFiHeader from "@/components/SportyFiHeader";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow flex items-center justify-center py-16 bg-gray-50">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-6xl font-bold text-sportyfi-orange mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't seem to exist. It might have been moved or deleted.
          </p>
          <Link to="/">
            <Button className="bg-sportyfi-orange hover:bg-red-600 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
