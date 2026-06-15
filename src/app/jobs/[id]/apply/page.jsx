import { getJobById } from "@/lib/api/jobs";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import JobApply from "./JobApply";
import { getApplicationsByApplicant } from "@/lib/api/applications";
import Link from "next/link";
import { getPlanById } from "@/lib/api/plans";

const ApplyPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) {
    redirect(`/auth/signin?redirect=/jobs/${id}/apply`);
  }

  // Unauthorized Role Layout
  if (user.role !== "seeker") {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
        <div className="max-w-md text-center space-y-4 p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
            ⚠️
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Access Restricted
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Only job seekers can apply for positions. Please sign in with a
            seeker account to proceed.
          </p>
          <div className="pt-2">
            <Link
              href="/jobs"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const applications = await getApplicationsByApplicant(user.id);


  const plan =await getPlanById(user?.plan || "seeker_free");

  const job = await getJobById(id);
  const hasRemainingApplications = applications.length < plan.maxApplicationsPerMonth;

  // Calculate percentage for a visual progress bar
  const applicationPercentage = Math.min(
    (applications.length / plan.maxApplicationsPerMonth) * 100,
    100,
  );

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* Plan Usage Card */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {plan.name}
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-2">
                Application Usage
              </h2>
            </div>
            <div className="text-sm font-medium text-zinc-400">
              <span className="text-2xl font-bold text-white">
                {applications.length}
              </span>
              <span className="mx-1">/</span>
              {plan.maxApplications} used
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                hasRemainingApplications ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${applicationPercentage}%` }}
            />
          </div>

          {/* Limit Reached Warning & Upgrade Link */}
          {!hasRemainingApplications && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                You have reached the application limit for your current plan.
              </p>
              <Link
                href="/plans"
                className="whitespace-nowrap font-semibold text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          )}

          {hasRemainingApplications && (
            <p className="text-sm text-zinc-400">
              Want to unlock unlimited applications?{" "}
              <Link
                href="/plans"
                className="text-emerald-400 hover:underline font-medium"
              >
                View premium plans &rarr;
              </Link>
            </p>
          )}
        </div>

        {/* Dynamic Job Application Form Component Section */}
        {hasRemainingApplications ? (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
            <JobApply applicant={user} job={job} />
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40">
            <p className="text-zinc-500 text-sm">
              Please upgrade your subscription to apply for **
              {job?.title || "this position"}**.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
