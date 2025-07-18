import { CategoriesSection } from '../sections/category-section';
import HomeVideosSection from '../sections/home-videos-section';

interface HomeViewProps {
    categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
    return (
        <div className="mx-auto mb-10 px-5 pt-2.5 flex flex-col gap-y-6">
            <CategoriesSection categoryId={categoryId} />
            <HomeVideosSection categoryId={categoryId} />
        </div>
    );
};
