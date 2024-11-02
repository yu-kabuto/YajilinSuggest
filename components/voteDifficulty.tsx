"use client"
import { supabase } from "@/utils/supabase/supabase"
import { Dispatch, SetStateAction, ReactElement, useState, cache } from "react"
import { pickUp } from "./pickUp"

export default function VoteUI(props: {
    setProblem: Dispatch<SetStateAction<Problem>>;
    problem: Problem;
  }) {
    const [solverrate, setSolverrate] = useState<number>(0.0);
    const [num, setNum] = useState<number>(0);

    const voteDifficulty = cache(async (
        button: string,
        solverrate: number,
        num: number,
        setSolverrate: Dispatch<SetStateAction<number>>,
        problem: Problem
      ) => {
        
        let result = 0.0;
        let solverK = 0.0;
        let problemK = 0.0;
        let solveProb = 0.0;
        
        solveProb = Math.exp(solverrate/400.0)/(Math.exp(solverrate/400.0)+Math.exp(problem.diff/400.0));

        if(button == "easy"){
          result = 1.0;
        }
        if(button == "moderate"){
          result = 0.5;
        }
        if(button == "difficult"){
          result = 0.0;
        }

        solverK = 64.0 * Math.exp(-num/5.0);
        problemK = Math.min(32.0, 128.0/solverK);

        try {
            console.log(num, solverrate, problemK, solverK, result, solveProb);
            setSolverrate(solverrate + solverK * (result - solveProb));
            const { error } = await supabase
            .from('problems')
            .update({ difficulty: problem.diff - problemK * (result - solveProb) })
            .eq('id', problem.id)
        } catch (error) {
            console.log(error);
        }
      });
  
    const update = cache(async (button: string) => {
      if(props.problem.id != 0){
        await voteDifficulty(button, solverrate, num, setSolverrate, props.problem);
        setNum(num + 1);
      }
      await pickUp(solverrate, props.setProblem);
    });

    return(
    <>
        <button type="button" id="easy" onClick={(e) => {update("easy");}}>簡単/Easy</button>
        <button type="button" id="moderate" onClick={(e) => {update("moderate");}}>ちょうどいい/Moderate</button>
        <button type="button" id="difficult" onClick={(e) => {update("difficult");}}>難しい/Difficult</button>
    </>
    )
  }

  interface Problem {
    id: number;
    url: string;
    diff: number;
  }