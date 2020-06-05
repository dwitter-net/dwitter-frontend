
import React, { useState, useEffect, useRef, useContext } from "react";
import { DweetCard } from "./DweetCard";
import { Dweet, getDweets } from "./api";
import { Link, RouteComponentProps, NavLink } from "react-router-dom";
import { Context } from "./Context";
import { Helmet } from "react-helmet";
import { pageMaxWidth } from "./Context";

interface Props {
  order_by: string;
  name: string;
}

export const NotificationList: React.FC<
  Props & RouteComponentProps<{ hashtag?: string; username?: string }>
> = (props) => {

    return (<div>notification!</div>);
};
