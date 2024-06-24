import React from "react";

export const ReportProblem = () => {
  return (
    <>
      <h2 className="text-4xl font-bold">Report A Problem</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-24 font-semibold text-gray-200">Report</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="about" className="text-lg font-medium">
             About:
            </label>
            <input
              type="text"
              name="about"
              id="about"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="problem" className="text-lg font-medium">
              Problem:
            </label>
            <textarea
              type="text"
              name="problem"
              id="problem"
              className="h-[245px] text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200 resize-none"
            />
          </div>
        </form>

        <div className="flex justify-center">
          <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Report Problem
          </button>
        </div>
      </div>
    </>
  );
};
