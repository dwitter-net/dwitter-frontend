import React from "react";
import { Dweet } from "./api";
import { UserViewRight } from "./UserView";
import { Link } from "react-router-dom";

export const RemixOf: React.FC<{ dweet: Dweet | null }> = (props) => {
    if(!props.dweet){
        return null;
    }
    return (
        <div className="mb-3" style={{
          float:"right"
        }}>
          {'Remix of '}
          <Link to={"/d/" + props.dweet.id} className="no-link-color" >
            <span style={{
                opacity:"0.5"
              }}>
                d/
            </span>
            {props.dweet.id}
          </Link>
          {' by '}
          <UserViewRight user={props.dweet.author} />
        </div>
    );
}
