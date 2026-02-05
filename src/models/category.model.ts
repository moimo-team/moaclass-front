export interface LessonCategory {
    id: number;
    name: string;
}

export interface LessonCategoriesResponse {
    lessonCategories: LessonCategory[];
}

export interface LessonSubCategory {
    id: number;
    name: string;
}

export interface LessonSubCategoriesResponse {
    lessonSubCategories: LessonSubCategory[];
}