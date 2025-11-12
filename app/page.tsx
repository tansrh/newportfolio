'use client';
import { useSelector, useDispatch } from "react-redux";
import { selectEditMode } from "../store/selectors";
import { setEditMode } from "../store/slices/editModeSlice";
import CommonButton from "../components/common/CommonButton";
import { RootState } from "../store/rootStore";
import AboutSection from "@/components/About/AboutSection";
import AchievementsSection from "@/components/Achievements/AchievementsSection";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import ContactSection from "@/components/Contact/ContactSection";
import ExperienceSection from "@/components/Experience/ExperienceSection";
import styles from './page.module.scss';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiRequest';
import { BlogData } from "@/store/slices/blogsSlice";
import Loading from "./loading";
import Error from "@/app/error";
import { useEffect, useMemo } from "react";
import { useToast } from "@/components/ToastProvider";
import { logout } from "@/store/slices/authSlice";

const useSavePortfolio = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: BlogData) => {
      return apiRequest('/api/portfolio', 'PUT', portfolioData);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }); // Corrected query key type
        dispatch(setEditMode(false));
        addToast("Portfolio saved successfully!");
      }
      else if (data?.error == "Unauthorized") {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        dispatch(logout());
        addToast("An error occured. Please login again.");
      }

    },
    onError: (error) => {
      addToast(error.message || "Error saving portfolio");
      return <Error message={error.message || "Error saving portfolio"} />;
    },
  });
};

export default function Home() {
  const editMode = useSelector(selectEditMode);
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await apiRequest('/api/portfolio', 'GET');
      return response.portfolio ?? {};
    },
  });
  const defaultPortfolio: any = useMemo(() => ({
    about: {},
    experience: [],
    achievements: [],
    contact: [],
    projects: [],
  }), []);

  // const portfolioData: any = defaultPortfolio;

  const methods = useForm<BlogData>({
    defaultValues: defaultPortfolio,
  });

  useEffect(() => {
    if (!isLoading && portfolio) {
      methods.reset(portfolio);
    }
  }, [isLoading, portfolio, methods]);

  const savePortfolioMutation = useSavePortfolio();

  const onSave = methods.handleSubmit((data) => {
    savePortfolioMutation.mutate(data);

  });
  const onDiscard = () => {
    dispatch(setEditMode(false));
    methods.reset();
  }


  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error message="Failed to load portfolio data." />;
  }

  return (
    <main className="min-h-screen w-full font-sans flex justify-center bg-gray-100">
      <FormProvider {...methods}>
        <div className={styles.container}>
          {isUserLoggedIn &&
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              {!editMode ? (
                <CommonButton onClick={() => dispatch(setEditMode(true))}>Edit</CommonButton>
              ) : (
                <>
                  <CommonButton onClick={onDiscard}>Discard</CommonButton>
                  <CommonButton onClick={onSave}>Save</CommonButton>
                </>
              )}
            </div>
          }
          {
            ((Object.keys(portfolio || {}).length === 0) && !editMode) ? (
              <div className={styles.noPortfolio}>No portfolio data available.</div>
            ) :
              <>
                <AboutSection data={portfolio.about} editMode={editMode} />
                <ExperienceSection data={portfolio.experience} editMode={editMode} />
                <AchievementsSection data={portfolio.achievements} editMode={editMode} />
                <ContactSection data={portfolio.contact} editMode={editMode} />
                <ProjectsSection data={portfolio.projects} editMode={editMode} />
              </>
          }

        </div>
      </FormProvider>
    </main>
  );
}
