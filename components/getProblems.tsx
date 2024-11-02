import { supabase } from "@/utils/supabase/supabase"
import { Dispatch, SetStateAction } from "react"

export default async function getProblems(
) {
  const tmpProblemList = []
  try {
    let { data: problems, error } = await supabase
      .from('problems')
      .select('*')
      .order('difficulty')
    if (error) {
      console.log(error)
    }

    if (problems != null) {
        for (let index = 0; index < problems.length; index++) {
          tmpProblemList.push(
              {
                  id: problems[index]["id"],
                  url: problems[index]["problemurl"] ?? "",
                  diff: problems[index]["difficulty"] ?? 0.0,
              }
          )
      }
      return tmpProblemList;
    }
  } catch (error) {
    console.log(error);
  }
}

interface Problem {
    id: number;
    url: string;
    diff: number;
  }