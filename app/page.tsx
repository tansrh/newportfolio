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

const useSavePortfolio = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolioData: BlogData) => {
      return apiRequest('/api/portfolio', 'PUT', portfolioData);
    },
    onSuccess: () => {
      console.log('Portfolio saved successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] }); // Corrected query key type
      dispatch(setEditMode(false));
    },
    onError: (error) => {
      console.error('Error saving portfolio:', error);
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
      return response.portfolio;
    },
  });
    const defaultPortfolio = {
    about: {},
    experience: [],
    achievements: [],
    contact: [],
    projects: [],
  };

  const portfolioData =  portfolio ?? defaultPortfolio; 

  const methods = useForm<BlogData>({
    defaultValues: portfolioData,
  });

  const savePortfolioMutation = useSavePortfolio();

  const onSave = methods.handleSubmit((data) => {
    savePortfolioMutation.mutate(data);

  });
  const onDiscard = ()=>{
    dispatch(setEditMode(false));
    methods.reset();
  }


  if (isLoading) {
    return <Loading/>
  }

  if (error) {
    return <div>Error loading portfolio.</div>;
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
                <AboutSection data={portfolioData.about} editMode={editMode} />
                <ExperienceSection data={portfolioData.experience} editMode={editMode} />
                <AchievementsSection data={portfolioData.achievements} editMode={editMode} />
                <ContactSection data={portfolioData.contact} editMode={editMode} />
                <ProjectsSection data={portfolioData.projects} editMode={editMode} />
              </>
          }

        </div>
      </FormProvider>
    </main>
  );
}
