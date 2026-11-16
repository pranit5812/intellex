"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SurveyQuestions from "@/components/component/survey/survey-questions";
import SurveyComplete from "@/components/component/survey/survey-complete";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/hooks/use-auth";

const Survey = () => {
	const router = useRouter();
	const userData = useAuth(router);
	const [surveyCompleted, setSurveyCompleted] = useState(false);

	return (
		<AuthGuard>
		<main className="max-w-2xl mx-auto py-10">
			{!surveyCompleted ? (
				<div className="mb-4 px-4">
					<h1 className="text-3xl font-bold">Survey</h1>
					<p>Please answer the following questions</p>
					<SurveyQuestions
						onSurveyComplete={() => setSurveyCompleted(true)}
					/>
				</div>
			) : (
				<SurveyComplete />
			)}
		</main>
		</AuthGuard>
	);
};

export default Survey;
