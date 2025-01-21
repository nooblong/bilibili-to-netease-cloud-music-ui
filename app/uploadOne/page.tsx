'use client'

import {Payment, columns} from "./columns"
import {DataTable} from "./data-table"
import {fuckGet} from "@/lib/utils";
import {useEffect} from "react";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const response = await fuckGet("/api/uploadDetail/list");
  return await response.json();
}

export default async function DemoPage() {

  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={[]}/>
    </div>
  )
}
