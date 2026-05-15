import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Achievements from "./pages/Achievements";
import Lounges from "./pages/Lounges";
import LoungeDetail from "./pages/LoungeDetail";
import KidsCorner from "./pages/KidsCorner";
import SocialFeed from "./pages/SocialFeed";
import Games from "./pages/Games";
import Merch from "./pages/Merch";
import Admin from "./pages/Admin";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/ "} component={Home} />
      <Route path={"/"} component={Home} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/achievements"} component={Achievements} />
      <Route path={"/lounges"} component={Lounges} />
      <Route path={"/lounges/:loungeId"} component={LoungeDetail} />
      <Route path={"/kids-corner"} component={KidsCorner} />
      <Route path={"/feed"} component={SocialFeed} />
      <Route path={"/games"} component={Games} />
      <Route path={"/merch"} component={Merch} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
