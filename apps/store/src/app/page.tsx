import { Button } from "@nexcom/ui/components/ui/button";
import React from "react";
import { api } from "~/lib/trpc/server";

const Home = async () => {
  const data = await api.mirror.query("Mirror is workinggggg!");
  return (
    <div>
      Home
      <br />
      <Button>{data}</Button>
    </div>
  );
};

export default Home;
