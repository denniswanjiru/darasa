"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getCurrentUser } from "@/lib/actions";
import ClassCard from "@/components/ClassCard";
import type { AppCategory, ClassType, CurrentUser } from "@/lib/types";
import { createAvatarUrl, getStatus } from "@/lib/utils";
import noImage from "@/assets/noImage.jpg";
import ClassInfoModal from "@/components/modals/ClassInfoModal";
import Loader from "@/components/Loader";

type Category = {
  id: string;
  name: string;
  class: ClassType[];
};

type JointEnrollment = {
  id: string;
  class: { id: string }[];
};

export default function Index() {
  const supabase = createClientComponentClient();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [currentUserClasses, setCurrentUserClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("category")
        .select(`id, name, class(*)`);

      const categories: Category[] | null = data;
      setCategories(categories);
    };

    const fetchEnrollments = async () => {
      const { data } = await supabase
        .from("enrollment")
        .select(`id, class(id)`)
        .eq("student_id", currentUser?.id ?? "");

      const enrollments: JointEnrollment[] | null = data;

      const currentUserClasses = enrollments
        ? enrollments.map((enrollment) => enrollment.class[0]?.id)
        : [];

      setCurrentUserClasses(currentUserClasses);
    };

    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
    };

    Promise.all([fetchCurrentUser(), fetchCategories(), fetchEnrollments()])
      .catch(() => setError("Something went wrong"))
      .finally(() => setIsLoading(false));
  }, [supabase, currentUser?.id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Explore All Classes</h2>

      {categories
        ? categories?.map(({ id, name, class: classes }) => (
            <div key={id}>
              {classes.length ? (
                <section className="mt-10">
                  <h3 className=" font-semibold text-xl">{name}</h3>

                  <div className="grid grid-cols-3 grid-flow-dense gap-6 mt-5">
                    {classes
                      ? classes.map(
                          ({
                            id,
                            code,
                            start_date,
                            end_date,
                            thumbnail,
                            name,
                            instructor_id,
                          }) => (
                            <ClassCard
                              id={id}
                              key={id}
                              code={code}
                              name={name}
                              showInfo={(id) => setSelected(id)}
                              type={
                                getStatus(start_date, end_date) === "Completed"
                                  ? "normal"
                                  : "enroll"
                              }
                              isEnrolled={currentUserClasses.includes(id)}
                              thumbnail={
                                thumbnail ? createAvatarUrl(thumbnail) : noImage
                              }
                              instructorId={instructor_id}
                              className="w-full"
                            />
                          )
                        )
                      : null}
                  </div>
                </section>
              ) : null}
            </div>
          ))
        : null}

      {selected ? (
        <ClassInfoModal
          selected={selected}
          onClose={() => setSelected(null)}
          enroll={!currentUserClasses.includes(selected)}
        />
      ) : null}
    </div>
  );
}
