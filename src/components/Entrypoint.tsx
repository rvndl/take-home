import { useEffect, useState } from "react";
import { DeletedListItem, ListItem, useGetListData } from "../api/getListData";
import { Card } from "./Card";
import { Spinner } from "./Spinner";
import { useStore } from "../store";
import { ActionButton, ToggleButton } from "./Buttons";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const Entrypoint = () => {
  const [areVisibleCardsVisible, setAreVisibleCardsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<ListItem[]>([]);
  const [deletedCards, setDeletedCards] = useState<DeletedListItem[]>([]);
  const [animationRef] = useAutoAnimate();

  const {
    deletedCardIds,
    expandedCardIds,
    addDeletedCard,
    addExpandedCard,
    removeExpandedCard,
  } = useStore((state) => state);

  const {
    data: cards,
    isLoading,
    refetch,
    isRefetching,
    error,
    isError,
  } = useGetListData();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const initialVisibleCards = cards?.filter((card) => !card.isVisible) ?? [];
    const deletedCards = initialVisibleCards.filter((card) =>
      deletedCardIds.includes(card.id)
    );
    const visibleCards = initialVisibleCards.filter(
      (card) => !deletedCardIds.includes(card.id)
    );

    setDeletedCards(deletedCards);
    setVisibleCards(visibleCards);
  }, [cards, deletedCardIds, isLoading]);

  const handleOnCardDelete = (cardId: number) => {
    addDeletedCard(cardId);
  };

  const handleOnCardCollapse = (cardId: number, isCollapsed: boolean) =>
    isCollapsed ? removeExpandedCard(cardId) : addExpandedCard(cardId);

  if (isError) {
    return (
      <section>
        <p className="text-red-500">An error has occurred: {error.message}</p>
        <ActionButton onClick={() => refetch()}>Retry</ActionButton>
      </section>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="gap-x-16 grid grid-cols-2 max-w-screen-xl w-full h-screen">
      <div className="w-full max-w-xl">
        <h1 className="mb-1 font-medium text-lg">
          My Awesome List ({visibleCards.length})
        </h1>
        <div className="flex flex-col gap-y-3" ref={animationRef}>
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              variant="visible"
              card={card}
              onCardDelete={handleOnCardDelete}
              onCardCollapse={handleOnCardCollapse}
              isDefaultCollapsed={!expandedCardIds.includes(card.id)}
            />
          ))}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="mb-1 font-medium text-lg">
            Deleted Cards ({deletedCards.length})
          </h1>
          <div className="flex items-center justify-center gap-x-2">
            <ActionButton
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              {isRefetching ? "Refreshing..." : "Refresh"}
            </ActionButton>
            <ToggleButton
              onToggle={(isToggled) => setAreVisibleCardsVisible(isToggled)}
              disabled={deletedCards.length === 0}
              toggledText="Hide"
              untoggledText="Reveal"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-3" ref={animationRef}>
          {areVisibleCardsVisible &&
            deletedCards.map((card) => (
              <Card key={card.id} variant="deleted" card={card} />
            ))}
        </div>
      </div>
    </div>
  );
};
