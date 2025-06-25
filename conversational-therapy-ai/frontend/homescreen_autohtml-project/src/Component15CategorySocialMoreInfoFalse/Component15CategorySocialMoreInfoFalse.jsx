import "./Component15CategorySocialMoreInfoFalse.css";

export const Component15CategorySocialMoreInfoFalse = ({
  category = "body",
  moreInfo = "true",
  className,
  ...props
}) => {
  const variantsClassName = "category-" + category + " more-info-" + moreInfo;

  return (
    <div
      className={
        "component-15-category-social-more-info-false " +
        className +
        " " +
        variantsClassName
      }
    >
      <img className="vector" src="vector0.svg" />
      <div className="social">
        <div className="_12">-12% </div>
        <div className="social2">Social </div>
      </div>
    </div>
  );
};
