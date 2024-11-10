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
    const [prevprob, setPrevProb] = useState<Problem>(
      {
        id: 0,
        url: "error",
        diff: 1000000.0
      });
    const [prevbutton, setPrevbutton] = useState<number>(0);

    const voteDifficulty = cache(async (
        button: number,
        solverrate: number,
        num: number,
        setSolverrate: Dispatch<SetStateAction<number>>,
        problem: Problem
      ) => {
        
        let solveresult = 0.0;
        let probresult = 0.0;
        let solverK = 64.0 * Math.exp(-num/3.0);
        let problemK = 32.0;
        let solveProb = Math.exp(solverrate/400.0)/(Math.exp(solverrate/400.0)+Math.exp(problem.diff/400.0));
        let winProb = Math.exp(problem.diff/400.0)/(Math.exp(problem.diff/400.0)+Math.exp(prevprob.diff/400.0));

        if(button == 0){
          solveresult = 1.0;
        }
        if(button == 1){
          solveresult = 0.5;
        }
        if(button == 2){
          solveresult = 0.0;
        }

        if(button > prevbutton){
          probresult = 1.0;
        } else if(button < prevbutton){
          probresult = 0.0;
        } else {
          if(button != 1) return;
          probresult = 0.5;
        }

        setSolverrate(solverrate + solverK * (solveresult - solveProb));

        if(prevprob.url == "error") return;

        try {
            const { error } = await supabase
            .from('problems')
            .update({ difficulty: problem.diff + problemK * (probresult - winProb) })
            .eq('id', problem.id)
        } catch (error) {
            console.log(error);
        }
        try {
          const { error } = await supabase
          .from('problems')
          .update({ difficulty: prevprob.diff - problemK * (probresult - winProb) })
          .eq('id', prevprob.id)
        } catch (error) {
            console.log(error);
        }
        });
  
    const update = cache(async (button: number) => {
      if(props.problem.id != 0){
        await voteDifficulty(button, solverrate, num, setSolverrate, props.problem);
        setNum(num + 1);
      }
      setPrevProb(props.problem);
      setPrevbutton(button);
      await pickUp(solverrate, num, props.setProblem);
    });

    return(
    <>
        <button type="button" id="easy" onClick={(e) => {update(0);}}>簡単/Easy</button>
        <button type="button" id="moderate" onClick={(e) => {update(1);}}>ちょうどいい/Moderate</button>
        <button type="button" id="difficult" onClick={(e) => {update(2);}}>難しい/Difficult</button>
    </>
    )
  }

  interface Problem {
    id: number;
    url: string;
    diff: number;
  }