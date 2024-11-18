import { FC, useState } from "react";
import { DeletedListItem, ListItem } from "../api/getListData";
import { Button, DeleteButton } from "./Buttons";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type VisibleCardProps = {
  variant: "visible";
  card: ListItem;
  onCardDelete: (cardId: number) => void;
  onCardCollapse: (cardId: number, isCollapsed: boolean) => void;
};

type DeletedCardProps = {
  variant: "deleted";
  card: DeletedListItem;
  onCardDelete?: never;
  onCardCollapse?: never;
};

// Make a union type for card props to decide
// which props are required for each variant type.
type CardProps = {
  isDefaultCollapsed?: boolean;
} & (VisibleCardProps | DeletedCardProps);

export const Card: FC<CardProps> = ({
  card,
  variant,
  isDefaultCollapsed = true,
  onCardDelete,
  onCardCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);
  const [animationRef] = useAutoAnimate();

  const handleOnCardCollapse = () => {
    const inversion = !isCollapsed;

    setIsCollapsed(inversion);
    onCardCollapse?.(card.id, inversion);
  };

  const handleOnCardDelete = () => onCardDelete?.(card.id);

  return (
    <div className="border border-black px-2 py-1.5">
      <div className="flex justify-between mb-0.5">
        <h1 className="font-medium">{card.title}</h1>
        {/* Since deleted cards don't have a description and it
            would be pointless to show delete button for them,
            so we just hide all the actions for deleted cards.

            We can add the future "Restore" button here and
            change the logic a little bit.
        */}
        {variant === "visible" && (
          <div className="flex">
            <Button onClick={handleOnCardCollapse}>
              {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Button>
            <DeleteButton onClick={handleOnCardDelete} />
          </div>
        )}
      </div>
      <div ref={animationRef}>
        {variant === "visible" && !isCollapsed && (
          <p className="text-sm">{card.description}</p>
        )}
      </div>
    </div>
  );
};
