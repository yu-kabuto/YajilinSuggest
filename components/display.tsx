"use client"
import { ReactElement, useState, useEffect } from "react"
import VoteUI from "./voteDifficulty"

export default function display() {
  const [problem, setProblem] = useState<Problem>(
    {
      id: 0,
      url: "Click any button for the first problem",
      diff: 1000000.0
    }
  );

  return (
    <>
      Problem URL:
      <a id="problem" href={problem.url} target="_blank">{problem.url}</a>
      <br/>
      <VoteUI setProblem={setProblem} problem={problem}></VoteUI>
    </>
    /*
    <div className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/3 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Todoリスト</h1>
        <AddTask taskList={setTaskList}></AddTask>
        <ul className="mt-4 divide-y divide-gray-200">
          {taskList}
        </ul>
      </div>
    </div>
    */
  )
}

interface Problem {
  id: number;
  url: string;
  diff: number;
}