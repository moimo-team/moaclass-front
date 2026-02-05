import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  goToNextPage?: () => void;
  goToPreviousPage?: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const PaginationComponent = ({
  totalPages,
  page,
  setPage,
  goToNextPage,
  goToPreviousPage,
  isFirstPage,
  isLastPage,
}: PaginationComponentProps) => {
  const finalIsFirstPage = isFirstPage ?? page === 1;
  const finalIsLastPage = isLastPage ?? page === totalPages;
  const finalGoToNextPage = goToNextPage ?? (() => setPage(page + 1));
  const finalGoToPreviousPage = goToPreviousPage ?? (() => setPage(page - 1));

  const renderPageItems = () => {
    const pageItems = [];

    const createLink = (p: number) => (
      <PaginationItem key={p}>
        <PaginationLink
          href="#"
          isActive={p === page}
          onClick={(e) => {
            e.preventDefault();
            setPage(p);
          }}
        >
          {p}
        </PaginationLink>
      </PaginationItem>
    );

    // 5페이지 이하인 경우: 링크 전부 보여줌
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(createLink(i));
      }
      return pageItems;
    }

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
      pageItems.push(createLink(1));
      if (startPage > 2)
        pageItems.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(createLink(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pageItems.push(<PaginationEllipsis key="end-ellipsis" />);
      pageItems.push(createLink(totalPages));
    }

    return pageItems;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!finalIsFirstPage) finalGoToPreviousPage();
            }}
            aria-disabled={finalIsFirstPage}
            className={
              finalIsFirstPage ? "pointer-events-none text-muted-foreground" : ""
            }
          />
        </PaginationItem>

        {renderPageItems()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!finalIsLastPage) finalGoToNextPage();
            }}
            aria-disabled={finalIsLastPage}
            className={
              finalIsLastPage ? "pointer-events-none text-muted-foreground" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
