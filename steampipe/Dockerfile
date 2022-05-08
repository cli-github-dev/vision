FROM turbot/steampipe
LABEL email="7424069@gmail.com"
LABEL name="cjsrkd3321 (rex.chun)"

RUN steampipe plugin install steampipe && steampipe plugin install aws 

USER root

RUN apt-get update -y && apt-get install -y git curl

USER steampipe:0

RUN git clone https://github.com/turbot/steampipe-mod-aws-insights.git
WORKDIR /workspace/steampipe-mod-aws-insights

# expose postgres service default port
EXPOSE 9193

# expose dashboard service default port
EXPOSE 9194

COPY docker-entrypoint.sh /usr/local/bin
COPY credentials /home/steampipe/.aws/credentials
COPY config /home/steampipe/.aws/config
COPY aws.spc /home/steampipe/.steampipe/config/aws.spc

# ENV STEAMPIPE_DATABASE_PASSWORD fb50_4f86_ba12
ENTRYPOINT [ "docker-entrypoint.sh" ]