import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import WorkWithMe from "@/pages/work-with-me";
import Masterclass from "@/pages/masterclass";
import Checkout from "@/pages/checkout";
import Watch from "@/pages/watch";
import Apply from "@/pages/apply";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import AdminVerify from "@/pages/admin-verify";
import Quiz from "@/pages/quiz";
import FreeMeditation from "@/pages/free-meditation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/work-with-me" component={WorkWithMe} />
      <Route path="/masterclass" component={Masterclass} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/watch" component={Watch} />
      <Route path="/apply" component={Apply} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-verify" component={AdminVerify} />
      <Route path="/free-meditation" component={FreeMeditation} />
      <Route path="/quiz" component={Quiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
