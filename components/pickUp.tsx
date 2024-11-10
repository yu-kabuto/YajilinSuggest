import { Dispatch, SetStateAction, useState, useEffect, cache } from "react"
import getProblems from "./getProblems"

export async function pickUp(
  standard: number,
  num: number,
  setProblem: Dispatch<SetStateAction<Problem>>
){
  const list = await getProblems();

  const allowance = Math.max(64.0 * Math.exp(-num/2.0), 1.0);

  let closest =
    {
      id: 0,
      url: "error",
      diff: 1000000.0
    };
    
  let close: string | any[] = [];

  let max = 0;
  let random = 0;
  
  if(list != undefined){
    for (let index = 0; index < list.length; index++) {
      if(Math.abs(list[index].diff - standard) < Math.abs(closest.diff - standard)){
        closest = list[index];
      }
      if(Math.abs(list[index].diff - standard) < allowance){
        close = [...close, 
              {
                  id: list[index]["id"],
                  url: list[index]["url"] ?? "",
                  diff: list[index]["diff"] ?? 0.0,
              }
          ]
        }
      }
    }
  
  if(close.length){
    max = close.length;
    random = Math.floor(Math.random() * max);
    setProblem(close[random]);
  } else {
    setProblem(closest);
  }
}

interface Problem {
  id: number;
  url: string;
  diff: number;
}