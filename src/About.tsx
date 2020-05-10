import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";

export const About: React.FC<RouteComponentProps> = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 600, flex: 1 }}>
        <div className="card mt-3 p-3">
          <p style={{ fontWeight: "bold" }}>About dwitter.net</p>
          <p>
            Dwitter.net is a challenge to see what awesomeness you can create
            when limited to only 140 characters of javascript and a canvas. Give
            it a go!
          </p>
          <p>
            It was created by <Link to="/u/lionleaf">u/lionleaf</Link> as a side
            project inspired by the concept of{" "}
            <Link to="/u/sigveseb">u/sigveseb</Link> at{" "}
            <a
              href="https://arkt.is/t/Yy53aWR0aD0yZTM7dCo9Mzt4LnRyYW5zbGF0ZSg5ODAsNDUwKTtmb3IoaT0wO2k8MzIyOyl4LmZpbGxTdHlsZT1SKGkpLHgucm90YXRlKCFpKkModC09LjAzKSshKGkrKyU0KSpTKHQpLzkrMS41NykseC5maWxsUmVjdCg1KmksNSppLDk5LDk5KQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              arkt.is/t
            </a>{" "}
            (
            <a
              href="https://github.com/sigvef/arktis-tweet-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              github
            </a>
            ). Its first official launch was at the Demoparty 'Solskogen' in
            2016 where it won{" "}
            <a
              href="http://www.pouet.net/prod.php?which=67794"
              target="_blank"
              rel="noopener noreferrer"
            >
              the wild compo
            </a>
            .
          </p>
          <p>
            The website itself is open source, and is being developed by a
            number of{" "}
            <a
              href="https://github.com/lionleaf/dwitter/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
            >
              contributors
            </a>
            . We are happy to accept pull requests and issues on{" "}
            <a
              href="https://github.com/lionleaf/dwitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              github
            </a>
            . Check out the{" "}
            <a
              href="https://github.com/lionleaf/dwitter/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              issue tracker
            </a>{" "}
            for previous suggestions and discussions.
          </p>
          <p>
            Please join us in the{" "}
            <a
              href="https://discord.gg/emHe6cP"
              target="_blank"
              rel="noopener noreferrer"
            >
              discord chat
            </a>{" "}
            to hang out, ask for coding help, or discuss anything :D If you
            don't know where to start and want to learn, this is the perfect
            place to start. See you there!
          </p>

          <p style={{ fontWeight: "bold" }}>Contact</p>
          <p>
            <em>andreas.l.selvik@gmail.com</em> and{" "}
            <em>sigvefarstad@gmail.com</em> or <strong>@lionleaf</strong> and{" "}
            <strong>@sigveseb</strong> on{" "}
            <a
              href="https://discord.gg/emHe6cP"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
